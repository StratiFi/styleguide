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
            'src': './src/scss/stratifi/stratifi.scss'
        },
        'docs': {
            'path': './src/scss/docs',
            'src': './src/scss/docs/docs.scss'
        }
    },
    'js': {
        'src': [
            './bower_components/jquery/dist/jquery.min.js',
            './bower_components/tether/dist/js/tether.min.js',
            './bower_components/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/highlight.js/lib/highlight.js'
        ]
    },
    'css': {
        'src': {
            'reqular': [
                './node_modules/highlight.js/styles/default.css',
                './dist/css/stratifi.css',
                './dist/css/docs.css'
            ],
            'min': [
                './node_modules/highlight.js/styles/default.css',
                './dist/css/stratifi.min.css',
                './dist/css/docs.min.css'
            ]
        }
    },
    'fonts': {
        'format': '{ttf,woff,woff2,eot,svg,otf}',
        'dest': './dist/',
        'src': [ './src/assets/**/*.' ]
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

gulp.task('sass:min', function () {
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

gulp.task('copy:fonts', function () {
    return gulp.src(config.fonts.src + config.fonts.format)
        .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('js:min', function () {
    return gulp.src(config.js.src)
        .pipe(concat('app.min.js'))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest(config.dest + '/js'));
});

gulp.task('css:min', ['sass:min'], function () {
    return gulp.src(config.css.src.min)
        .pipe(concat('app.min.css'))
        .pipe(gulp.dest(config.dest + '/css'));
});

gulp.task('inject:prod', ['css:min', 'js:min', 'html', 'copy:fonts'], function () {
    return gulp.src(config.html.src)
        .pipe(inject(
            gulp.src([
                // TODO Refactor this
                './dist/js/app.min.js',
                './dist/css/app.min.css'
            ], {read: false})
            , {relative: true}
        ))
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('inject:dev', ['sass', 'html'], function () {
    return gulp.src(config.html.src)
        .pipe(inject(
            gulp.src([
                // TODO Refactor this
                './node_modules/highlight.js/styles/default.css',
                './dist/css/stratifi.css',
                './dist/css/docs.css',

                './bower_components/jquery/dist/jquery.min.js',
                './bower_components/tether/dist/js/tether.min.js',
                './bower_components/bootstrap/dist/js/bootstrap.min.js',
                './node_modules/highlight.js/lib/highlight.js'
            ], {read: false})
            , {relative: true}
        ))
        .pipe(gulp.dest(config.html.dest));
});

gulp.task('install', function () {});

gulp.task('build:dev', ['inject:dev'], function () {});

gulp.task('dev:watch', function () {
    gulp.watch([
        config.sass.path + '/**/*.scss',
        config.html.src
    ], ['build:dev']);
});

gulp.task('build:prod', ['inject:prod'], function () {});