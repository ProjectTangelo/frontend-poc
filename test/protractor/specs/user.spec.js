describe('Basic User Tests', function(){
  
  // TODO: Create a default basic user to login with.
  // Login as a basic user
  beforeEach(function() {
    browser.get('http://33.33.33.10/login.html');
    element(by.id('user-username')).sendKeys('admin');
    element(by.id('user-password')).sendKeys('himitsu');
    element(by.buttonText('Submit')).click();

    browser.driver.wait(function(){
      return browser.driver.getCurrentUrl().then(function(url){
        return url == 'http://33.33.33.10/#/home';
      });
    }, 2000);
  });


  describe('Login Spec', function(){
    
    it('redirects to home page after login', function() {
      expect(browser.getTitle()).toEqual('tangelo');
    });

    it('shows admin page', function(){
      expect( element( by.id('admin-page' ) ).isPresent() ).toBe(false);
      expect( element( by.id('client-page') ).isPresent() ).toBe(true );
    });

  });

});