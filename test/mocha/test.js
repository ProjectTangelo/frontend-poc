console.log('Starting server...');
var tangelo = require('../../app');

before(function (done) {
  tangelo.mongoose.connection.on('open', function () {
    console.log('Resetting database <%s>...', tangelo.get('db'));
    tangelo.mongoose.connection.db.dropDatabase(function () {
      tangelo.service('user').createAdmin(function () {
        console.log('...done!');
        done();
      });
    });
  });
});

var request = require('supertest')(tangelo);
var session = require('superagent').agent();
var should = require('should');
var faker = require('faker');


describe('API', function () {

  describe('auth', function () {
    it('should accept logins', function (done) {
      request
        .post('/login')
        .send({
          username: tangelo.get('default admin username'),
          password: tangelo.get('default admin password'),
        })
        .expect({
          "success": tangelo.get('default admin username')
        })
        .end(done);
    });
    it('should accept logouts', function (done) {
      request
        .get('/logout')
        .expect({
          "success": true
        })
        .end(done);
    });
  });

});

after(function (done) {
  tangelo.mongoose.connection.close(function () {
    console.log('...finished!');
    done();
  });
});
