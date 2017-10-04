const serviceFinder = require('find-local-services')

const PLURALS = {
  pharmacy: 'pharmacies',
  dentist: 'dentists',
  doctor: 'doctors'
}

module.exports = function (input, req) {
  input.isHomepage = false
  input.title = input.local_header_title = 'Service Finder Results'
  input.hasOmniSearch = false
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

  input.savedLocation = req.cookies.savedLocation

  // ask to save the user's searched location if the searched location
  // is different from the saved location
  input.askToSaveLocation = input.savedLocation !== input.find_service_search

  return serviceFinder.locateAddress(input.find_service_search)
    .then(location => {
      console.log('Geocoding returned', location)
      input.lat = location.lat
      input.long = location.lng
      return input
    })
    .then(location => serviceFinder.findLocalServices(
      {lat: location.lat, lng: location.long}, input.find_service_type
    ))
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
