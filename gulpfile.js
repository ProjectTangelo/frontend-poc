var gulp = require('gulp');
var mocha = require('gulp-mocha');
var protractor = require('gulp-protractor').protractor;

var webdriver_standalone = require("gulp-protractor").webdriver_standalone;

gulp.task('webdriver_standalone', webdriver_standalone);

gulp.task('mocha', function (done) {
  gulp.src('./test/mocha/**/*.js')
    .pipe(mocha({
      colors: true,
      bail: true,
      timeout: 10000,
    }))
    .once('end', done);

});

gulp.task('protractor', function(){
  gulp.src(['./test/protractor/specs/**/*.js'])
  	.pipe(protractor({
  		configFile: 'test/protractor/protractor-config.js',
  		verbose: false,
  		includeStackTrace: false
  		// args: ['--verbose', 'false',]
  	}))
  	.on('error', function(e) { throw e });
});

gulp.task('default', ['webdriver_standalone', 'protractor']);
// gulp.task('default', ['webdriver_standalone', 'protractor'¸ 'mocha']);
