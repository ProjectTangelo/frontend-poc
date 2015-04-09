var request = require('request');
var path = require('path');

var baseURL = 'http://33.33.33.10';
var defaultTimeOut = 2000;

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
    }, defaultTimeOut);

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
      }, defaultTimeOut);

      expect(browser.getCurrentUrl()).toBe(baseURL + '/login.html');
    });

  });


  describe('Admin Panel Spec', function(){
    // This fails because logout does not redirect to an angular page. Also test might need some fixing.
    it('only allows admin into admin panel', function(){
      element(by.linkText('Sign Out')).click();
      browser.setLocation('/');

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/';
        });
      }, defaultTimeOut);

      expect( element( by.id('admin-page' ) ).isPresent() ).toBe(false);
    });

  });


  describe('User Management Spec', function(){


    describe('Creating Users', function(){

      var username, fname, lname, email, type, password, confirm, submit;

      beforeEach(function(){
        username = element(by.model('user.username'));
        fname = element(by.model('user.name_first'));
        lname = element(by.model('user.name_last'));
        email = element(by.model('user.email'));
        type = element(by.id('radio-user-type'));
        password = element(by.model('user.password'));
        confirm = element(by.id('user-password-confirm'));
        submit = element(by.buttonText('Submit'));
      });

      it('creates a single user', function(){
        browser.setLocation('users/add');

        username.sendKeys('Test');
        fname.sendKeys('Tyler');
        lname.sendKeys('Davidson');
        email.sendKeys('tyler@david.johnny');
        type.click();
        password.sendKeys('eduardo');
        confirm.sendKeys('eduardo');
        submit.click();

      });

      it('does not create duplicate users', function(){

        // Checks the number of users before the test starts.
        browser.setLocation('users');
        var startCount;
        element.all(by.binding('user.username')).count().then(function(count){
          startCount = count;
        });

        // Check if the user already existed before we try to add.
        var newUserName = 'MultipleTest';
        var alreadyExists = false;
        element.all(by.binding('user.username')).each(function(element, index){
          element.getText().then(function(text){
            if( text == newUserName )
              alreadyExists = true;
          });
        });

        // Tries to add duplicate users.
        for( var i = 0; i < 2; ++i ) {
          browser.setLocation('users/add');

          username.sendKeys(newUserName);
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();
        }

        // Counts after it tries to add duplicate users.
        browser.setLocation('users');
        element.all(by.binding('user.username')).count().then(function(count){
          // Make sure that we didn't add duplicate users.
          expect( count ).toBe( startCount + ((alreadyExists)? 0:1) );
        });

        element.all(by.binding('user.username')).each(function(element, index){
          element.getText().then(function(text){
            if( text == newUserName )
              element.click();
          });
        });

      });

      // TODO: Catch mongoose errors for this. Same for all probably.
      // This crashes the server.
      it('requires username', function(){
          /*
          browser.setLocation('users/add');

          // username.sendKeys(Test);
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users/add');

          browser.setLocation('users/add');

          username.sendKeys('UsernameRequiredTest');
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users/');
          */
      });

      it('requires password', function(){

      });

      it('requires user type', function(){

      });

      it('requires email address', function(){

      });

      it('does not require first name', function(){
          browser.setLocation('users/add');
          var newUserName = 'FirstNameNotRequired'

          username.sendKeys(newUserName);
          // fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

          browser.setLocation('users/add');

          username.sendKeys(newUserName);
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');
      });

      it('does not require last name', function(){
          browser.setLocation('users/add');
          var newUserName = 'LastNameNotRequired'

          username.sendKeys(newUserName);
          fname.sendKeys('Tyler');
          // lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

          browser.setLocation('users/add');

          username.sendKeys(newUserName);
          fname.sendKeys('Tyler');
          lname.sendKeys('Davidson');
          email.sendKeys('tyler@david.johnny');
          type.click();
          password.sendKeys('eduardo');
          confirm.sendKeys('eduardo');
          submit.click();

          expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');
      });

      it('creates multiple users through bulk import', function(){

      });

      it('edits a user', function(){

      });

      it('deletes a user', function(){
        browser.setLocation('users');

        var startCount;
        element.all(by.binding('user.username')).count().then(function(count){
          startCount = count;
        });

        // Adds a user to delete.
        browser.setLocation('users/add');
        var newUserName = 'DeleteUser'

        username.sendKeys(newUserName);
        fname.sendKeys('Tyler');
        // lname.sendKeys('Davidson');
        email.sendKeys('tyler@david.johnny');
        type.click();
        password.sendKeys('eduardo');
        confirm.sendKeys('eduardo');
        submit.click();

        expect(browser.getCurrentUrl()).toBe(baseURL + '/#/users');

        // Deletes the user.
        element.all(by.id('delete-button')).last().click();

        // Checks to make sure that the user was deleted.
        element.all(by.binding('user.username')).count().then(function(count){
          expect( count ).toBe( startCount );
        });
      });

    })

  });


  describe('Lesson Spec', function(){

    it('adds lessons', function(){
      var lessonName = 'AddedLessonTest';
      var filePath = './admin.spec.js';
      var absolutePath = path.resolve(__dirname, filePath);
      
      browser.setLocation('lessons/add');

      element(by.model('lesson.name')).sendKeys(lessonName);
      element(by.model('lesson.file')).sendKeys(absolutePath);
      element(by.buttonText('Submit')).click();

      browser.driver.wait(function(){
        return browser.driver.getCurrentUrl().then(function(url){
          return url == baseURL + '/#/lessons';
        });
      }, defaultTimeOut);

      var found = false;
      element.all(by.exactBinding('file.name')).filter(function(elem, index){
        return elem.getText().then(function(text){
          return text === lessonName;
        });
      }).then(function(filteredElements){
          expect( filteredElements.length > 0 ).toBe(true);
      });
      
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