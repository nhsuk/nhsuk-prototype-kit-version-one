function pharmacyMapHandler (input, req) {
  input.title = 'Pharmacy Finder Prototype'

  if (!input.validated.latitude) {
    input.redirect = 'your-location'
  } else {
    input.apiKey = process.env.GOOGLE_MAPS_API_KEY
  }

  return input
}

module.exports = pharmacyMapHandler
