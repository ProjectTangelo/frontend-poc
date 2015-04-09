var request = require('request');

describe('Login Spec', function() {

  beforeEach(function() {
    browser.get('http://33.33.33.10/login.html');
    element(by.id('user-username')).sendKeys('admin');
    element(by.id('user-password')).sendKeys('himitsu');
    element(by.buttonText('Submit')).click();
  });

  it('should be logged in', function() {
    browser.setLocation('/');
    expect(browser.getTitle()).toEqual('tangelo');
  });

});