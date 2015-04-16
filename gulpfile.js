var gulp = require('gulp');
var bluebird = require('bluebird');
var runSequence = require('run-sequence');

var mocha = require('gulp-mocha');
var protractor = require('gulp-protractor').protractor;

gulp.task('mocha', function (done) {
  process.env.DB = process.env.DB || 'test';
  process.env.LOGLEVEL = process.env.LOGLEVEL || 'info';
  gulp.src('./test/mocha/**/*.js')
    .pipe(mocha({
      colors: true,
      bail: true,
      timeout: 10000,
    }))
    .once('end', done);
});


gulp.task('protractor', function () {
  gulp.src(['./test/protractor/specs/**/*.js'])
    .pipe(protractor({
      configFile: 'test/protractor/protractor-config.js',
      verbose: false,
      includeStackTrace: false
        // args: ['--verbose', 'false',]
    }))
    .on('error', function (e) {
      throw e
    });
});

gulp.task('test', function (done) {
  runSequence('mocha', done);
});

gulp.task('default', function (done) {
  runSequence('test', done);
});
