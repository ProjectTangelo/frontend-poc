var request = require('supertest');

var baseURL = 'http://33.33.33.10';

describe('Basic User Tests', function(){

  // TODO: Create a default basic user to login with.
  // Login as a basic user
  beforeEach(function() {
    browser.get(baseURL + '/login.html');
    element(by.id('user-username')).sendKeys('Ed');
    element(by.id('user-password')).sendKeys('shadow');
    element(by.buttonText('Submit')).click();

    browser.driver.wait(function(){
      return browser.driver.getCurrentUrl().then(function(url){
        return url == 'http://33.33.33.10/#/home';
      });
    }, 2000);
  });

  //Login test for user
  describe('Login Spec User', function(){
    it('redirects to home page after login', function() {
      expect(browser.getTitle()).toEqual('tangelo');
    });

    it('shows admin page', function(){
      // expect( element( by.id('admin-page' ) ).isPresent() ).toBe(false);
      // expect( element( by.id('client-page') ).isPresent() ).toBe(true );
    });

  });

  /*//Logging out as a user, does not work
  describe('Logout Spec User', function(){

    it('lets admin logout', function(){

      element(by.linkText('Sign Out')).click();

      var options = {
        url: baseURL + '/user',
        method: 'GET',
        json: true
      };

      request(options, function(error, response, body){
        expect( body.error.message ).toBe('Unauthorized');
      });

    });

    // TODO: This fails because we just go directly to /logout to logout. No other routing is happening.
    it('shows login page after logout', function(){
      element(by.linkText('Sign Out')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/login.html';
        });
      }, 2000);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/login.html');
    });

  });
  */

  //Testing the panels
  describe('Panel Tests', function(){

    it('Submissions', function(){
      element(by.linkText('Submissions')).click()
      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/submissions');
      //test to be added later
    });

    it('Scratch Pad', function(){
      element(by.linkText('ScratchPad')).click()
      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/scratch');
      var randTxt = element(by.model('scratchText.value'));
      randTxt.sendKeys('Guns N Roses');
      expect(randTxt.getAttribute('value')).toEqual('Guns N Roses');
    });

    it('Lesson Plans', function(){
      element(by.linkText('Lesson Plans')).click();
      expect(browser.getCurrentUrl()).toBe(baseURL + '/#/lesson');
      var lessonEx = element.all(by.binding('value.name'));
      expect(lessonEx.count()).toBeGreaterThan(0);
    });

  });
  //
});
