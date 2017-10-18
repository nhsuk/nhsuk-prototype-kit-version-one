'use strict'

const pa11y = require('pa11y')
const path = require('path')
const htmlReporter = require('pa11y-reporter-html')
const fs = require('fs')

//  --------------------------------------------------------
//  CONFIGURATION
//  --------------------------------------------------------

const testUrls = [
    {name: 'Homepage', url: 'http://localhost:3000/'},
    {name: 'Test page', url: 'http://localhost:3000/examples/test'}
]

const testConfig = {
  // Reporting level
  includeNotices: false,
  includeWarnings: true,
  // Accessibility standard [Section508, WCAG2A, WCAG2AA, WCAG2AAA]
  standard: 'WCAG2AAA',
  // Log activity to the console
  log: {
    debug: console.log,
    error: console.error,
    info: console.log
  }
}

//  --------------------------------------------------------
// RECURSIVE FUNCTION
//  --------------------------------------------------------

testUrls.forEach(function (test) {
  pa11y(test.url, testConfig).then(results => {
    // log results to console
    console.log(results)
    // log results to HTML
    htmlReporter.results(results).then(markup => {
      writeReportToHTML(markup, test.name)
    })
  })
})

//  --------------------------------------------------------
// UTILS
//  --------------------------------------------------------

function writeReportToHTML (htmlText, name) {
  const fileName = createFileName(name)
  const filePath = path.join(__dirname, 'reports/', fileName)
  fs.appendFile(filePath, htmlText, function (err) {
    if (err) {
      return console.log(err)
    }
    console.log('Saved report to ' + filePath)
  })
}

function createFileName (name) {
  const d = new Date()
  const datestring = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2) + '_' + ('0' + d.getHours()).slice(-2) + ('0' + d.getMinutes()).slice(-2)
  return (datestring + '_' + name + '.html')
}
