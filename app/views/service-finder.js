const distance = require('gps-distance')
const maps = require('@google/maps').createClient({
  key: process.env.GOOGLE_MAPS_API_KEY,
  Promise: Promise
})

const PLURALS = {
  pharmacy: 'pharmacies',
  dentist: 'dentists',
  optician: 'opticians',
  doctor: 'doctors'
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
  return Promise.all(places.map(place =>
    maps.place({placeid: place.place_id}).asPromise()
      .then(response => response.json.result)
      .then(transformPlaceDetailsForTemplate)
  ))
}

function transformPlaceDetailsForTemplate (details) {
  const transformed = {
    id: details.id,
    place_id: details.place_id,
    name: details.name,
    address: reformatAddress(details.formatted_address),
    phone: details.formatted_phone_number,
    rating: details.rating,
    geometry: details.geometry,
    hours: computeOpeningHours(details.opening_hours)
  }
  return transformed
}

function reformatAddress (address) {
  return address.replace(/, (UK|United Kingdom)$/, '')
}

function computeOpeningHours (openingHours) {
  return openingHours
}

function computeDistanceInMiles (input, place) {
  const KM_TO_MILES_DIVISOR = 1.609344
  const { geometry: { location: {lat, lng} } } = place
  return distance(input.lat, input.long, lat, lng) / KM_TO_MILES_DIVISOR
}

function computeDistances (places, input) {
  places.forEach(place => {
    const placeDistance = computeDistanceInMiles(input, place).toFixed(1)
    place.distance = `${placeDistance} miles`
  })
  return places
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
    { value: 'optician', label: 'Optician' },
    { value: 'doctor', label: 'GP' }
  ].map(type => {
    if (input.find_service_type === type.value) {
      type.isSelected = true
    }
    return type
  })

  return geocodeAddress(input.find_service_search)
    .then(extractGeocodedLocationFromResult)
    .then(location => {
      console.log('Geocoding returned', location)
      input.lat = location.lat
      input.long = location.lng
      return input
    })
    .then(placeSearch)
    .then(placeDetails)
    .then(places => computeDistances(places, input))
    .then(results => {
      input.results = results
      input.resultCount = results.length
      input.resultDescription = (
        results.length === 1
          ? input.find_service_type
          : PLURALS[input.find_service_type]
      ) + ' within 2 miles of this location'
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
