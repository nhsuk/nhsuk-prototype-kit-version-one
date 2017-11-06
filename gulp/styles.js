/*
  styles.js
  ===========
  compiles sass from assets folder with the govuk_modules
  also includes sourcemaps
*/
const config = require('../config.js').gulp
const gulp = require('gulp')
const sass = require('gulp-sass')
const postcss = require('gulp-postcss')

gulp.task('styles', () => {
  return gulp.src(config.css.src)

    // Sass Compilation
    .pipe(sass({
      errLogToConsole: true
    })).on('error', sass.logError)

    // PostCSS tasks after Sass compilation
    .pipe(postcss([
      require('autoprefixer')({ browsers: ['> 5%', 'last 2 versions', 'ie > 7'] }),
      require('cssnano')({
        preset: 'default'
      })
    ]))

    // Output compiled CSS
    .pipe(gulp.dest(config.css.dest))
})
