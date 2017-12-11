const session = require('express-session')
const validator = require('express-validator')

module.exports = function (app, hbs) {
  app.use(
    '/',
    session({
      secret: 'sauce',
      resave: false,
      saveUninitialized: false
    }),
    validator()
  )

  // utility route to clear session and cookies
  app.get('/_clear', (req, res) => {
    req.session.destroy()
    res.redirect('/')
  })

  const checkTemplateExists = req => templates => {
    if (!templates[`${req.params.prototype}.hbs`]) throw new Error(`Prototype template '${req.params.prototype}.hbs' not found`)
  }

  const prototypeHandler = req => {
    let modulePath = `../views/${req.params.prototype}.js`

    // use resolve to quietly check for the existence of the code-behind file
    try {
      require.resolve(modulePath)
    } catch (e) {
      modulePath = ''
    }

    // require the code-behind module if it exists
    return modulePath
         ? require(modulePath)
         : input => input
  }

  const generateInput = req => () => {
    const input = Object.assign({},
      req.body,
      req.query,
      {validated: req.session.validated || {}}
    )
    return prototypeHandler(req)(input, req)
  }

  const validateRequest = req => input => {
    return req.getValidationResult().then(result => {
      input.valid = result.isEmpty()
      input.errors = Object.assign({}, input.errors, result.mapped())
      return input
    })
  }

  const redirectOrRender = (req, res) => input => {
    if (input.valid && input.redirect) {
      const redirect = typeof input.redirect === 'string'
                     ? input.redirect : input.redirect()
      return Promise.resolve(redirect).then(redirect => {
        res.redirect(redirect)
        res.end()
      })
    }
    res.render(req.params.prototype, input)
  }

  app.all('/:prototype(*)', (req, res, next) => {
    hbs.getTemplates('app/views')
       .then(checkTemplateExists(req))
       .then(generateInput(req))
       .then(validateRequest(req))
       .then(redirectOrRender(req, res))
       .catch(ex => {
         console.log(ex)
         next(ex)
       })
  })
}
