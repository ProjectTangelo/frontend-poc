module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		protractor: {
			options: {
				configFile: 'test/protractor-config.js',
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
	grunt.registerTask('test', ['protractor_webdriver:start', 'protractor:e2e']);
}