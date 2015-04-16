var gulp = require('gulp');
var runSequence = require('run-sequence');
var mocha = require('gulp-mocha');

gulp.task('test', function (done) {
  process.env.DB = process.env.DB || 'test';
  process.env.LOGLEVEL = process.env.LOGLEVEL || 'info';
  gulp.src('./test/**/*.js')
    .pipe(mocha({
      colors: true,
      bail: true,
      timeout: 10000,
    }))
    .once('end', done);
});

gulp.task('default', function (done) {
  runSequence('test', done);
});
