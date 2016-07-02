var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer');

var config = {
  'src': 'src',
  'dest': 'dist',

  'html': {
    'src': 'src/*.html',
    'dest': 'dist/'
  },

  'sass': {
    'dest': 'dist/css',
    'path': 'src/scss',
    'stratifi': {
      'path': 'src/scss/stratifi',
      'src' : 'src/scss/stratifi/stratifi.scss'
    },
    'docs': {
      'path': 'src/scss/docs',
      'src': 'src/scss/docs/docs.scss'
    }
  }
};

gulp.task('sassMax', function () {
  return gulp.src([
        config.sass.stratifi.src,
        config.sass.docs.src
      ])
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: '> 5%'
      }))
      .pipe(gulp.dest(config.sass.dest));
});

gulp.task('sassMin', function () {
  return gulp.src([
      config.sass.stratifi.src,
      config.sass.docs.src
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: '> 5%'
    }))
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

gulp.task('build', ['sassMax', 'html'], function () {
  // voila
});

gulp.task('watch', function () {
  gulp.watch([
    config.sass.path + '/**/*.scss',
    config.html.src
  ], ['build']);
});

gulp.task('default', ['build'], function () {
  // voila
});
