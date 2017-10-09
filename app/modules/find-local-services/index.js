const memoize = require('promise-memoize')

module.exports = {
  // geolocation results are cached indefinitely
  locateAddress: memoize(locateAddress),

  // Place searches are cached for 5 minutes
  findLocalServices: memoize(findLocalServices, {maxAge: 5 * 60 * 1000, resolve: 'json'})
}

// warn if there's no API key set up
if (!process.env.GOOGLE_MAPS_API_KEY) {
  console.warn('No Google Maps API key has been set! See readme.md for details on how to set it.')
}

const distance = require('gps-distance')
const moment = require('moment-timezone')
const querystring = require('querystring')
const maps = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})

const SOON_IN_MILLISECONDS = 1 * 60 * 60 * 1000 // 1 hour

/**
 * Use geocoding to convert the supplied address into a coordinate pair
 *
 * @param {string} address - the address to geocode
 * @returns {Promise<{lat, lng}>}
 */
function locateAddress (address) {
  return geocodeAddress(address)
    .then(extractGeocodedLocationFromResult)
}

/**
 * Given a coordinate pair and a type, produce a result set of services ordered
 * by distance.
 *
 * @param {Object} location
 * @param {number} location.lat
 * @param {number} location.lng
 * @param {string} serviceType
 * @returns {Promise<[Object]>}
 */
function findLocalServices (location, serviceType) {
  return placeSearch(location, serviceType)
    .then(placeDetails)
    .then(places => computeDistances(places, location))
    .then(places => computeDirectionsUrls(places, location))
}

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

function placeSearch (location, serviceType) {
  const query = {
    location: location,
    type: serviceType,
    rankby: 'distance'
  }

  return maps.placesNearby(query).asPromise()
    .then(response => response.json.results)
    .then(places => places.filter(place => !place.permanently_closed))
    .then(places => places.slice(0, 8))
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

function computeDistanceInMiles (location, place) {
  const KM_TO_MILES_DIVISOR = 1.609344
  const { geometry: { location: {lat, lng} } } = place
  return distance(location.lat, location.lng, lat, lng) / KM_TO_MILES_DIVISOR
}

function computeDistances (places, location) {
  places.forEach(place => {
    const placeDistance = computeDistanceInMiles(location, place).toFixed(1)
    place.distance = `${placeDistance} miles away`
  })
  return places
}

function computeDirectionsUrls (places, location) {
  places.forEach(place => {
    place.directions_url = computeDirectionUrl(location, place)
  })
  return places
}

function computeDirectionUrl (location, place) {
  const qs = querystring.stringify({
    api: 1,
    origin: `${location.lat},${location.lng}`,
    destination: `${place.geometry.location.lat},${place.geometry.location.lng}`,
    destination_place_id: place.place_id
  })
  return `https://www.google.com/maps/dir/?${qs}`
}
