module.exports = function (input, req) {
  input.title = 'Complex page flow'

  if (req.method === 'POST') {
    // if the redirect variable is for the simple page flow example,
    // increment a counter in the session that it will pick up
    if (input.redirect === 'simple-page-flow') {
      const validated = req.session.validated || {}

      req.session.validated = Object.assign({}, validated, {
        complexVisited: (validated.complexVisited || 0) + 1
      })
    }
  }

  return input
}
