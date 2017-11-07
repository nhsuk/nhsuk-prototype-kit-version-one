var gulp = require('gulp')
var runSequence = require('run-sequence')

gulp.task('production', function (done) {
  runSequence(
    'move-nhsuk-assets',
    'scripts',
    'styles',
    done
  )
})
