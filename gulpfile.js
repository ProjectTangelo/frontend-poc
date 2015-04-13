var gulp = require('gulp');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');
var protractor = require('gulp-protractor').protractor;


gulp.task('mocha', function (done) {
  process.env.DB = process.env.DB || 'test';
  gulp.src('./test/mocha/**/*.js')
    .pipe(mocha({
      colors: true,
      bail: true,
      timeout: 10000,
    }))
    .once('end', done);
});

gulp.task('test', function (done) {
  runSequence('mocha', done);
});

gulp.task('default', function (done) {
  gulp.run('test', done);
});
