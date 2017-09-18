const config = require('../config').gulp
const path = require('path')
const assetsLocation = path.join(config.paths.nodeModules, 'package-name', 'dist-folder')
const gulp = require('gulp')

gulp.task('move-nhsuk-assets', () => {
  return gulp.src(assetsLocation)
    .pipe(gulp.dest(config.paths.public))
})
