/*
  scripts.js
  ===========
  copies Javascript files from assets to public
*/
const config = require('../config.js').gulp

const gulp = require('gulp')

gulp.task('scripts', () => {
  return gulp.src(config.scripts.src)
    .pipe(gulp.dest(config.scripts.dest))
})
