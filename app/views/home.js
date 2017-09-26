module.exports = function (input) {
  input.isHomepage = true
  input.title = false
  input.lede = 'Welcome to the new NHS website. <label for="query">Search for health problems, medicines, NHS services, healthy living tips and more.</label>'
  input.hasOmniSearch = true
  return input
}
