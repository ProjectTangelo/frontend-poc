var gulp = require('gulp');
var mocha = require('gulp-mocha');
var protractor = require('gulp-protractor').protractor;


gulp.task('mocha', function (done) {
  gulp.src('./test/mocha/**/*.js')
    .pipe(mocha({
      colors: true,
      bail: true,
      timeout: 10000,
    }))
    .once('end', done);
});

gulp.task('default', []);
