const fetch = require('node-fetch')
const qs = require('querystring')

const ROUGH_BOUNDS_OF_ENGLAND = [[-5.8337, 49.9335], [1.8787, 55.8167]]

module.exports = function (input, req) {
  input.title = 'Service Finder Prototype'
  input.error = {
    postcodeFormat: false,
    locationOutOfRange: false
  }

  input.isPostcodeStrategy = input.locationStrategy === 'postcode'
  input.isGeolocationStrategy = input.locationStrategy === 'geolocation'

  if (req.method === 'POST') {
    // as there are async operations involved, always return a Promise
    let p = Promise.resolve(input)

    // if using postcode strategy, use an API to convert it to a location
    switch (input.locationStrategy) {
      case 'postcode':
        p = p.then(input => {
          const q = qs.stringify({
            region: 'uk',
            address: input.postcode,
            key: process.env.GOOGLE_MAPS_API_KEY
          })
          return fetch(`https://maps.googleapis.com/maps/api/geocode/json?${q}`)
            .then(response => response.json())
            .then(result => {
              if (result.status !== 'OK') {
                throw new Error(result.error_message)
              }
              return result.results[0]
            })
            .then(({ geometry: { location: { lat, lng } } }) => {
              console.log('Postcode API returned', lat, lng)
              input.lat = lat
              input.long = lng
              return input
            })
            .catch(e => {
              console.log('Geocoding error:', e)
              // consider any error to be a postcode format error
              // TODO: more nuanced error management
              input.error.postcodeFormat = true
              return input
            })
        })
        break

      case 'geolocation':
        break

      default:
    }

    p = p.then(input => {
      const {lat: latitude, long: longitude} = input

      // check that the location is within the rough boundary of England
      if (latitude && longitude) {
        const [[minLong, minLat], [maxLong, maxLat]] = ROUGH_BOUNDS_OF_ENGLAND

        if (longitude < minLong || longitude > maxLong || latitude < minLat || latitude > maxLat) {
          input.error.locationOutOfRange = true
        } else {
          // perform the pharmacy search here
          input.redirect = function () {
            req.session.validated = Object.assign({}, req.session.validated, {
              latitude,
              longitude,
              isGeolocationStrategy: input.isGeolocationStrategy,
              location: input.postcode
            })
            return 'service-map'
          }
        }
      }

      return input
    })

    return p
  }

  return input
}
