const gulp = require('gulp')
const config = require('../config').gulp

gulp.task('watch-sass', function () {
  return gulp.watch(config.css.src, {cwd: './'}, ['styles'])
})
