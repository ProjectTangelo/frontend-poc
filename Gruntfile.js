module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mocha: {
      test: {
        src: ['./test/mocha/**/*.js'],
        options: {
          colors: true,
          bail: true,
          timeout: 10000,
        }
      }
    },
    protractor: {
      options: {
        configFile: 'test/protractor/protractor-config.js',
        noColor: false,
        args: {}
      },
      e2e: {
        options: {
          keepAlive: false
        }
      }
    },
    protractor_webdriver: {
      start: {
        options: {
          command: 'webdriver-manager start'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-protractor-webdriver');
  grunt.loadNpmTasks('grunt-protractor-runner');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.registerTask('mocha', ['mocha']);
  grunt.registerTask('test', ['protractor_webdriver:start', 'protractor:e2e']);
}
