exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['specs/*.spec.js'],

	/*
	// Logs in as the admin user before every test. Don't use it because there are tests for the basic user.
	onPrepare: function(){
		 // browser.driver.ignoreSynchronization = true;

	    browser.driver.get('http://33.33.33.10/login.html');
	    element(by.id('user-username')).sendKeys('admin');
	    element(by.id('user-password')).sendKeys('himitsu');
	    element(by.buttonText('Submit')).click();

	    browser.driver.wait(function(){
	      return browser.driver.getCurrentUrl().then(function(url){
	        return url == 'http://33.33.33.10/#/home';
	      });
	    }, 2000);

	    // browser.waitForAngular();
	}
	*/
};