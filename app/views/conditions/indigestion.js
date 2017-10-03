const serviceFinder = require('find-local-services')

module.exports = function (input, req) {
  input.isHomepage = false
  input.local_header_title = 'Indigestion'
  input.local_header_text = 'Most people have indigestion at some point. Usually, it’s not a sign of anything more serious and you can treat indigestion yourself.'
  input.hasOmniSearch = false

  // if the user has saved a location, perform a search for local pharmacies
  // and send details of the closest open one to the template
  // as this is an asynchronous operation, it returns a Promise
  if (req.cookies && req.cookies.savedLocation) {
    return serviceFinder.locateAddress(req.cookies.savedLocation)
      .then(location => serviceFinder.findLocalServices(
        location, 'pharmacy'
      ))
      .then(results => {
        if (results && results.length) {
          const openPharmacy = results.find(result => {
            return result.hours && result.hours.open_now
          })
          input.pharmacy = openPharmacy
        }
        return input
      })
      .catch(ex => {
        console.log('Geocoding error:', ex)
        return input
      })
  }
  return input
}
