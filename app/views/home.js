module.exports = function (input, req) {
  input.isHomepage = true
  input.savedLocation = req.cookies.savedLocation
  return input
}
