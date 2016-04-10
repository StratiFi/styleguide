var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano');
    rename = require('gulp-rename');

var config = {
  'src': 'src',
  'dest': 'dist',

  'html': {
    'src': 'src/*.html',
    'dest': 'dist/',
  },

  'sass': {
    'src' : 'src/scss/stratifi.scss',
    'dest': 'dist/css',
  },
}

gulp.task('sassMax', function () {
  return gulp.src(config.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.sass.dest));
});

gulp.task('sassMin', function () {
  return gulp.src(config.sass.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(config.sass.dest));
});

gulp.task('html', function () {
  return gulp.src([config.html.src])
    .pipe(gulp.dest(config.html.dest));
});

gulp.task('inject', function () {
  // Gerald, do something
});

gulp.task('install', ['inject'], function () {
  // Gerald, do something
});

gulp.task('build', ['sassMax', 'sassMin', 'html'], function () {
  // voila
});

gulp.task('default', ['build'], function () {
  // voila
});
