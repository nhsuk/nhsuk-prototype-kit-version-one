const markdown = require('marked')
const path = require('path')
const fs = require('fs')
const express = require('express')

module.exports = function (router) {
  if (process.env.NODE_ENV !== 'production') {
    router.get('/docs/guides/:filename(*)', markdownHandler)
    router.use(
      '/docs/assets',
      express.static(path.join(__dirname, '../../docs/assets'))
    )
  }
}

function markdownHandler (req, res, next) {
  const { filename: filename = 'index.md' } = req.params

  try {
    const mdtext = fs.readFileSync(path.join(__dirname, '../../docs/guides', filename), 'utf8')
    res.render('docs', {markdown: markdown(mdtext)})
  } catch (_) {
    return next()
  }
}
