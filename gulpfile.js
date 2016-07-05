var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    inject = require('gulp-inject'),
    concat = require('gulp-concat');

var config = {
  'src': './src',
  'dest': './dist',

  'html': {
    'src': './src/*.html',
    'dest': './dist/'
  },

  'sass': {
    'dest': './dist/css',
    'path': './src/scss',
    'stratifi': {
      'path': './src/scss/stratifi',
      'src' : './src/scss/stratifi/stratifi.scss'
    },
    'docs': {
      'path': './src/scss/docs',
      'src': './src/scss/docs/docs.scss'
    }
  },
  
  'js': {
    'sources': [
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/tether/dist/js/tether.min.js',
        './bower_components/bootstrap/dist/js/bootstrap.min.js',
        './node_modules/highlight.js/lib/highlight.js'
    ]
  },
  
  'css': {
    'sources': {
        'reqular': [
            './bower_components/font-awesome/css/font-awesome.min.css',
            './node_modules/highlight.js/styles/default.css',
            './dist/css/stratifi.css',
            './dist/css/docs.css'
        ],
        'min': [
            './bower_components/font-awesome/css/font-awesome.min.css',
            './node_modules/highlight.js/styles/default.css',
            './dist/css/stratifi.min.css',
            './dist/css/docs.min.css'
        ]
    }
  }
};

gulp.task('sass', function () {
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

gulp.task('inject:dev', function () {
  // Gerald, do something
});

gulp.task('js:min', function () {
    return gulp.src(config.js.sources)
        .pipe(concat('app.min.js'))
        .pipe(uglify().on('error', function(e){
            console.log(e);
        }))
        .pipe(gulp.dest(config.dest + '/js'));
});

gulp.task('css:min', ['sassMin'], function () {
    return gulp.src(config.css.sources.min)
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(config.dest + '/css'));
});

gulp.task('inject:prod', ['css:min', 'js:min', 'html'], function () {
    return gulp.src(config.html.src)
        .pipe(inject(
            gulp.src([
                './dist/js/app.min.js',
                './dist/css/app.min.css'
            ], { read:false })
            , { relative: true }
        ))
        .pipe(gulp.dest(config.html.dest))
    ;
});

gulp.task('install', function () {
  // Gerald, do something
});

gulp.task('build:dev', ['sass', 'html'], function () {
  // voila
});

gulp.task('watch', function () {
  gulp.watch([
    config.sass.path + '/**/*.scss',
    config.html.src
  ], ['build:dev']);
});

gulp.task('default', ['build'], function () {
  // voila
});

gulp.task('build:prod', ['inject:prod'], function () {

});