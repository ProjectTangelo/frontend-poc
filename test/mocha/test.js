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

var request = require('supertest').agent(tangelo);
var should = require('should');
var faker = require('faker');

describe('API', function () {

  function login (user, done) {
    // user();
    if (!user) {
      throw new Error('Forgot to pass callback to login');
    }
    if (typeof user === 'function') {
      done = user;
      user = {
        username: tangelo.get('default admin username'),
        password: tangelo.get('default admin password'),
      }
    }
    request
      .post('/login')
      .send({
        username: user.username,
        password: user.password,
      })
      .expect(function (res) {
        // console.log(res);
        res.body.should.be.eql({
          'success': user.username
        });
      })
      .end(done);
  }

  describe('auth', function () {
    it('should accept logins', login);
    it('should accept logouts', function (done) {
      request
        .get('/logout')
        .expect({
          "success": true
        })
        .end(done);
    });
  });

  describe('/user', function () {
    var path = '/user';
    function makeUser () {
      function random_num () {
        var max = 1000000;
        var min = 0;
        return Math.floor(Math.random() * (max - min) + min) + '';
      }
      return {
        'username': faker.internet.userName(),
        'name_first': faker.name.firstName(),
        'name_last': faker.name.lastName(),
        'password': faker.internet.password(),
        'email': faker.internet.email().toLowerCase(),
        'type': 'user',
        'node_id': random_num(),
        'container_id': random_num(),
      }
    }
    describe('as Admin', function () {
      before(login);
      it('CREATE', function (done) {
        var user = makeUser();
        request
          .post(path)
          .send(user)
          .expect(function (res) {
            delete user.password;
            delete res.body.password;
            delete res.body._id;
            delete res.body.__v;
            res.body.should.be.eql(user);
          })
          .end(done);
      });
    });
  });

});

after(function (done) {
  tangelo.mongoose.connection.close(function () {
    console.log('...finished!');
    done();
  });
});
