module.exports = function (input, req) {
  input.isHomepage = true
  input.savedLocation = req.cookies.savedLocation
  input.title = false
  input.lede = 'Welcome to the new NHS website. <label for="query">Search for health problems, medicines, NHS services, healthy living tips and more.</label>'
  input.hasOmniSearch = true
  input.googleMapsLibraryUrl = `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`
  return input
}
