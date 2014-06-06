'use strict';
// Generated on 2014-03-26 using generator-gulp-webapp 0.0.4

var gulp = require('gulp');
var livereload = require('gulp-livereload');
var wiredep = require('wiredep').stream;
var rename = require('gulp-rename');
var browserify = require("gulp-browserify");

// Load plugins
var $ = require('gulp-load-plugins')();

// Styles
gulp.task('styles', function () {
    return gulp.src('app/sass/main.scss').
        pipe($.rubySass({
          style: 'expanded',
          loadPath: ['app/bower_components']
        })).
        pipe($.autoprefixer('last 1 version')).
        pipe(gulp.dest('app/styles')).
        pipe($.size());
});

gulp.task('scripts', function() {
    return gulp.src('app/scripts/main.js', {read: false}).
    pipe(browserify({
        insertGlobals : false,
        transform: ['reactify'],
        extensions: ['.jsx'],
        debug: !gulp.env.production
    })).
    pipe(rename('app.js')).
    pipe(gulp.dest('app/scripts'));
});

// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html').
      pipe($.useref()).
      pipe(gulp.dest('dist')).
      pipe($.size());
});

// Clean
gulp.task('clean', function () {
    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false}).pipe($.clean());
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});

// Watch
gulp.task('watch', function () {
    //var lr_server = livereload();
    // Watch for changes in `app` folder
    gulp.watch([
        'app/*.html',
        'app/styles/**/*.css',
        'app/scripts/app.js',
        'app/images/**/*'
    ], function(event) {
        lr_server.changed(event.path);
        return gulp.src(event.path);
    });

    // Watch .scss files
    gulp.watch('app/sass/**/*.scss', ['styles']);


    // Watch .js files
    gulp.watch('app/scripts/main.js', ['scripts']);
    gulp.watch('app/scripts/lib/*.js', ['scripts']);
    gulp.watch('app/scripts/**/*.jsx', ['scripts']);
});

gulp.task('dev', ['watch']);
