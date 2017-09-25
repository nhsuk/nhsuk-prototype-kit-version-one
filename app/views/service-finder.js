const distance = require('gps-distance')
const moment = require('moment-timezone')
const querystring = require('querystring')
const maps = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})

const PLURALS = {
  pharmacy: 'pharmacies',
  dentist: 'dentists',
  doctor: 'doctors'
}

const SOON_IN_MILLISECONDS = 1 * 60 * 60 * 1000 // 1 hour

function generateMapUrlForPlace (place) {
  const qs = querystring.stringify({
    key: process.env.GOOGLE_MAPS_API_KEY,
    q: `place_id:${place.place_id}`
  })
  return `https://www.google.com/maps/embed/v1/place?${qs}`
}

function geocodeAddress (address) {
  return maps.geocode({address, region: 'uk'}).asPromise()
    .then(response => response.json.results[0])
}

function extractGeocodedLocationFromResult (result) {
  const { geometry: { location } } = result
  return location
}

function placeSearch (input) {
  const query = {
    location: {lat: input.lat, lng: input.long},
    type: input.find_service_type,
    rankby: 'distance'
  }

  return maps.placesNearby(query).asPromise()
    .then(response => response.json.results)
    .then(places => places.filter(place => !place.permanently_closed))
}

function placeDetails (places) {
  const now = moment().tz('Europe/London').seconds(0).milliseconds(0)

  return Promise.all(places.map(place =>
    maps.place({placeid: place.place_id}).asPromise()
      .then(response => response.json.result)
      .then(details => transformPlaceDetailsForTemplate(details, now))
  ))
}

function transformPlaceDetailsForTemplate (details, now) {
  const transformed = {
    id: details.id,
    place_id: details.place_id,
    name: details.name,
    address: reformatAddress(details.formatted_address),
    phone: details.formatted_phone_number,
    rating: details.rating,
    geometry: details.geometry,
    hours: computeOpeningHours(details.opening_hours, now),
    url: details.website || '#',
    map_url: generateMapUrlForPlace(details)
  }
  return transformed
}

function reformatAddress (address) {
  return address.replace(/, (UK|United Kingdom)$/, '')
}

function findNextCloseTimeOnDay (periods, day, time) {
  const match = periods.find(
    period => period.close && period.close.day === day && period.close.time > time
  )

  return match && match.close.time
}

function findNextOpenTimeOnDay (periods, day, time) {
  const match = periods.find(
    period => period.open && period.open.day === day && period.open.time > time
  )

  return match && match.open.time
}

function isSoon (now, time, day) {
  return moment(now)
    .weekday(day)
    .hour(+time.substr(0, 2))
    .minute(+time.substr(2, 2))
    .diff(now) < SOON_IN_MILLISECONDS
}

function formatTime (now, time) {
  return moment(now)
    .hour(+time.substr(0, 2))
    .minute(+time.substr(2, 2))
    .format('LT')
    .replace(':00', '')
}

function computeOpeningHours (openingHours = {}, now) {
  const hours = {
    open_now: openingHours.open_now,
    status: openingHours.open_now ? 'Open' : 'Closed'
  }

  if (openingHours.periods) {
    const currentDay = now.weekday()
    const currentTime = now.format('HHmm')

    if (openingHours.open_now) {
      // does it close today or tomorrow?
      let closeTime = findNextCloseTimeOnDay(openingHours.periods, currentDay, currentTime)
      if (closeTime) {
        // closes later today
        hours.meta_status = `Closes ${formatTime(now, closeTime)}`
        hours.closing_soon = isSoon(now, closeTime, currentDay)
      } else {
        closeTime = findNextCloseTimeOnDay(openingHours.periods, (currentDay + 1) % 7, '')
        if (closeTime) {
          // closes some time tomorrow
          hours.meta_status = closeTime === '0000'
            ? `Closes midnight`
            : `Closes ${formatTime(now, closeTime)} tomorrow`
          hours.closing_soon = isSoon(now, closeTime, (currentDay + 1) % 7)
        }
      }
    } else {
      // does it open today or tomorrow?
      let openTime = findNextOpenTimeOnDay(openingHours.periods, currentDay, currentTime)
      if (openTime) {
        // opens later today
        hours.meta_status = `Opens ${formatTime(now, openTime)}`
        // soon: isSoon(now, openTime, currentDay)
      } else {
        openTime = findNextOpenTimeOnDay(openingHours.periods, (currentDay + 1) % 7, '')
        if (openTime) {
          // opens some time tomorrow
          hours.meta_status = openTime === '0000'
            ? `Opens midnight`
            : `Opens ${formatTime(now, openTime)} tomorrow`
          // soon: isSoon(now, openTime, (currentDay + 1) % 7)
        }
      }
    }
  }

  return hours
}

function computeDistanceInMiles (input, place) {
  const KM_TO_MILES_DIVISOR = 1.609344
  const { geometry: { location: {lat, lng} } } = place
  return distance(input.lat, input.long, lat, lng) / KM_TO_MILES_DIVISOR
}

function computeDistances (places, input) {
  places.forEach(place => {
    const placeDistance = computeDistanceInMiles(input, place).toFixed(1)
    place.distance = `${placeDistance} miles away`
  })
  return places
}

function computeDirectionsUrls (places, input) {
  places.forEach(place => {
    place.directions_url = computeDirectionUrl(input, place)
  })
  return places
}

function computeDirectionUrl (input, place) {
  const qs = querystring.stringify({
    api: 1,
    origin: `${input.lat},${input.long}`,
    destination: `${place.geometry.location.lat},${place.geometry.location.lng}`,
    destination_place_id: place.place_id
  })
  return `https://www.google.com/maps/dir/?${qs}`
}

module.exports = function (input, req) {
  input.title = 'Service Finder Results'
  input.error = {
    geocodingFailed: false
  }

  // build the dropdown list of service types and mark the one in use
  input.find_service_types = [
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'dentist', label: 'Dentist' },
    { value: 'doctor', label: 'GP' }
  ].map(type => {
    if (input.find_service_type === type.value) {
      type.isSelected = true
    }
    return type
  })

  input.automaticLocation = input.lat && input.long
  input.savedLocation = req.cookies.savedLocation
  input.askToSaveLocation = !input.automaticLocation &&
                            !req.cookies.savedLocation &&
                            !req.cookies.saveRefused

  // if the lat and long are already provided, there's no need to
  // geocode the search term
  const locationProvider = (input.lat && input.long)
    ? Promise.resolve(input)
        .then(input => {
          input.lat = parseFloat(input.lat)
          input.long = parseFloat(input.long)
          return input
        })
    : geocodeAddress(input.find_service_search)
        .then(extractGeocodedLocationFromResult)
        .then(location => {
          console.log('Geocoding returned', location)
          input.lat = location.lat
          input.long = location.lng
          return input
        })

  return locationProvider
    .then(placeSearch)
    .then(placeDetails)
    .then(places => computeDistances(places, input))
    .then(places => computeDirectionsUrls(places, input))
    .then(results => {
      input.results = results
      input.resultCount = results.length
      input.resultDescription = (
        results.length === 1
          ? input.find_service_type
          : PLURALS[input.find_service_type]
      ) + ' within 2 miles of this location'

      if (results.length) {
        input.starting_map_url = results[0].map_url
      }
      return input
    })
    .catch(e => {
      console.log('Geocoding error:', e)
      // consider any error to be a postcode format error
      // TODO: more nuanced error management
      input.error.geocodingFailed = true
      return input
    })
}
