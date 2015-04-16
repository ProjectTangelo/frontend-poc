console.log('Starting server...');
var tangelo = require('../app');

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
var Promise = require('bluebird');
var should = require('should');
var faker = require('faker');
var _ = require('lodash');

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
    describe('LOGIN', function () {
      it('requires username', function (done) {
        request
          .post('/login')
          .send({
            password: tangelo.get('default admin password'),
          })
          .expect({
            error: {
              message: 'Missing credentials'
            }
          })
          .end(done);
      });
      it('requires password', function (done) {
        request
          .post('/login')
          .send({
            username: tangelo.get('default admin username'),
          })
          .expect({
            error: {
              message: 'Missing credentials'
            }
          })
          .end(done);
      });
      it('works', login);
    });
    describe('LOGOUT', function () {
      it('works', function (done) {
        request
          .get('/logout')
          .expect({
            "success": true
          })
          .end(done);
      });
    });
  });

  describe('/user', function () {
    var path = '/user';
    var users = [];

    function getCredentials () {
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

    function makeUser () {
      return new Promise(function (resolve, reject) {
        var user = getCredentials();
        request.post(path).send(user).end(function (err, res) {
          if (err) reject(err);
          users.push(user);
          resolve();
        });
      });
    }

    describe('as Admin', function () {
      before(login);

      describe('CREATE', function () {
        function requires (property, done) {
          var user = getCredentials();
          delete user[property];
          request
            .post(path)
            .send(user)
            .expect(function (res) {
              res.body.error.message.should.equal('user validation failed');
            })
            .end(done);
        }
        it('requires username', function (done) {
          requires('username', done);
        });
        it('requires password', function (done) {
          requires('password', done);
        });
        it('works', function (done) {
          var user = getCredentials();
          request
            .post(path)
            .send(user)
            .expect(function (res) {
              delete user.password;
              delete res.body.password;
              delete res.body._id;
              delete res.body.__v;
              res.body.should.be.eql(user);
              users.push(user);
            })
            .end(done);
        });
      });

      describe('GET', function () {
        before(function (done) {
          var num_users = 5;
          var promises = [];
          for (var i = 0; i < num_users; i++)
            promises.push(makeUser());
          Promise.all(promises).then(function () {
            done();
          });
        });
        it('multiuser', function (done) {
          request
            .get(path)
            .expect(function (res) {
              res.body.should.be.Array;
              _.each(users, function (user) {
                delete user.password;
                var dbuser = _.findWhere(res.body, user)
                dbuser.should.not.equal(undefined);
                // get the IDs that mongo assigned them while we're at it
                user._id = dbuser._id;
              });
            })
            .end(done);
        });
        it('singleuser', function (done) {
          var user = users[0];
          request
            .get(path + '/' + user._id)
            .expect(function (res) {
              delete res.body.__v;
              delete res.body.password;
              user.should.eql(res.body);
            })
            .end(done);
        });

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
