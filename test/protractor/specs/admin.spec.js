var request = require('request');

var baseURL = 'http://33.33.33.10';

describe('Admin Tests', function() {

  // Login as Admin
  beforeEach(function() {
    // browser.driver.ignoreSynchronization = true;

    browser.get(baseURL + '/login.html');
    element(by.id('user-username')).sendKeys('admin');
    element(by.id('user-password')).sendKeys('himitsu');
    element(by.buttonText('Submit')).click();

    browser.driver.wait(function(){
      return browser.driver.getCurrentUrl().then(function(url){
        return url == baseURL + '/#/home';
      });
    }, 2000);

    // browser.waitForAngular();
  });


  describe('Login Spec', function(){
    
    it('redirects to home page after login', function() {
      expect(browser.getTitle()).toEqual('tangelo');
      // expect(browser.getCurrentUrl()).toBe(baseURL + '/#/home');
    });

    it('shows admin page', function(){
      expect( element( by.id('admin-page' ) ).isPresent() ).toBe(true );
      expect( element( by.id('client-page') ).isPresent() ).toBe(false);
    });

  });


  describe('Logout Spec', function(){

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


  describe('Admin Panel Spec', function(){

    it('only allows admin into admin panel', function(){

    });

  });


  describe('User Management Spec', function(){

    it('creates a single user', function(){

    });

    it('creates multiple users through bulk import', function(){

    });

    it('edits a user', function(){

    });

    it('deletes a user', function(){

    });

  });


  describe('Lesson Spec', function(){

    it('adds lessons', function(){

    });

    it('opens a lesson', function(){

    });

    it('deletes a lesson', function(){

    });

  });


  describe('User Submissions Spec', function(){
    
    it('views submissions', function(){

    });

    it('submits feedback', function(){

    });

  });


});