/**
 * .env file
 */
require('dotenv').config()
/**
 * Module dependencies
 */
const express = require('express')
const path = require('path')
const handlebars = require('express-handlebars')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
// const debug = require('debug')('nhsuk-prototype-kit:server')
// const http = require('http')
const chalk = require('chalk')
const favicon = require('serve-favicon')

/**
 * Config
 */
const config = require('./config.js').app

/**
 * Utils
 */
const utils = require('./lib/utils.js')

let username = process.env.AUTH_USERNAME || process.env.USERNAME
let password = process.env.AUTH_PASSWORD || process.env.PASSWORD
let env = process.env.NODE_ENV || 'development'
const useBrowserSync = config.useBrowserSync.toLowerCase()
const useAuth = process.env.USE_AUTH || config.useAuth.toLowerCase()

env = env.toLowerCase()

const router = express.Router()
const routes = require('./app/routes')

let app = express()

// Authenticate against the environment-provided credentials, if running
// the app in production
if (env === 'production' && useAuth === 'true') {
  app.use(utils.productionAuth(username, password))
}

// set view engine to handlebars
const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'nhsuk_layout',
  layoutsDir: 'app/views/layouts',
  partialsDir: 'app/views/partials',
  helpers: {
    'raw-helper': function (options) {
      return options.fn()
    }
  }
})
app.engine('.hbs', hbs.engine)
app.set('view engine', '.hbs')

app.set('views', path.join(__dirname, 'app', 'views'))

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists

routes(router, hbs)
app.use('/', router)

// Strip .html and .htm if provided
app.get(/\.html?$/i, function (req, res) {
  var path = req.path
  var parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

// Auto render any view that exists

// App folder routes get priority
app.get(/^\/([^.]+)$/, function (req, res) {
  utils.matchRoutes(req, res)
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

utils.findAvailablePort(app, function (port) {
  console.log(chalk.bgHex('#005eb8').bold('\n NHSUK prototype is now running \n'))
  console.log('Visit http://localhost:' + port + ' in your browser to view')
  if (env === 'production' || useBrowserSync === 'false') {
    app.listen(port)
  } else {
    app.listen(port - 50, function () {
      require('browser-sync')({
        proxy: 'localhost:' + (port - 50),
        port: port,
        ui: false,
        files: ['public/**/*.*', 'app/views/**/*.*'],
        ghostmode: false,
        open: false,
        notify: false,
        logLevel: 'error',
        reloadDelay: 1000
      })
    })
  }
})

module.exports = app
