module.exports = function (router) {
  router.get('/', function (req, res) {
    res.render('index', {
      title: 'NHSUK prototype kit'
    })
  })
}
