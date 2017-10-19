const gulp = require('gulp')
const config = require('../config').gulp
const runSequence = require('run-sequence')

gulp.task('watch-styles', function () {
  return gulp.watch(config.css.src, {cwd: './'}, ['styles'])
})

gulp.task('watch', function (done) {
  runSequence(
    'watch-styles',
     done
   )
})
