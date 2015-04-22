console.log('Starting server...');
var tangelo = require('../app');

before('reset database', function (done) {
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

var request = require('supertest');
var Promise = require('bluebird');
var should = require('should');
var faker = require('faker');
var _ = require('lodash');

// helpers

describe('auth', function () {
  var server = request.agent(tangelo);
  var credentials = {
    username: tangelo.get('default admin username'),
    password: tangelo.get('default admin password'),
  };

  describe('LOGIN', function () {
    it('requires username', function (done) {
      var user = _.clone(credentials);
      delete user.username;
      server
        .post('/login')
        .send(user)
        .expect(function (res) {
          res.body.should.eql({
            error: {
              message: 'Missing credentials'
            }
          });
        })
        .end(done);
    });
    it('requires password', function (done) {
      var user = _.clone(credentials);
      delete user.password;
      server
        .post('/login')
        .send(user)
        .expect(function (res) {
          res.body.should.eql({
            error: {
              message: 'Missing credentials'
            }
          });
        })
        .end(done);
    });
    it('users can LOGIN', function (done) {
      server
        .post('/login')
        .send(credentials)
        .expect(function (res) {
          res.body.should.have.property('success');
        })
        .end(done);
    });
  });
  describe('LOGOUT', function () {
    it('users can LOGOUT', function (done) {
      server
        .get('/logout')
        .expect({
          "success": true
        })
        .end(done);
    });
  });
});

describe('/user', function () {
  var admin = {
    agent: request.agent(tangelo),
    credentials: {
      username: tangelo.get('default admin username'),
      password: tangelo.get('default admin password'),
    },
  };
  var user = {
    agent: request.agent(tangelo),
    credentials: makeCredentials(),
  };

  function login (user) {
    return new Promise(function (resolve, reject) {
      user.agent
        .post('/login')
        .send(user.credentials)
        .end(function (err, res) {
          if (err) reject(err);
          resolve(res.body.success);
        });
    });
  }

  function makeCredentials (creds) {
    if (!creds)
      creds = {};

    return _.assign(creds, {
      'username': faker.internet.userName(),
      'name_first': faker.name.firstName(),
      'name_last': faker.name.lastName(),
      'password': faker.internet.password(),
      'email': faker.internet.email().toLowerCase(),
      'type': 'user',
      'node_id': _.random(0, 1000000) + '',
      'container_id': _.random(0, 1000000) + '',
    });
  }

  before('login admin', function (done) {
    login(admin).then(function (credentials) {
      admin.credentials = credentials;
      done();
    });
  });

  describe('CREATE', function () {
    it('admin can CREATE users', function (done) {
      admin.agent
        .post('/user')
        .send(user.credentials)
        .expect(function (res) {
          user.credentials.__v = res.body.__v;
          user.credentials._id = res.body._id;
          res.body.should.eql(_.omit(user.credentials, 'password'));
        })
        .end(function (err, res) {
          login(user).then(function (credentials) {
            done();
          });
        });
    });

    it('requires username', function (done) {
      admin.agent
        .post('/user')
        .send(_.omit(makeCredentials(), 'username'))
        .expect(function (res) {
          res.body.error.name.should.equal('ValidationError');
        })
        .end(done);
    });
    it('requires unique username', function (done) {
      admin.agent
        .post('/user')
        .send(user.credentials)
        .expect(function (res) {
          res.body.should.have.property('error');
          res.body.error.name.should.be.equal('MongoError');
        })
        .end(done);
    });
    it('requires password', function (done) {
      admin.agent
        .post('/user')
        .send(_.omit(makeCredentials(), 'password'))
        .expect(function (res) {
          res.body.error.name.should.equal('ValidationError');
        })
        .end(done);
    });
    it('requires admin', function (done) {
      user.agent
        .post('/user')
        .send(_.omit(makeCredentials(), 'username'))
        .expect(function (res) {
          res.body.should.eql({
            error: {
              message: 'Unauthorized',
            }
          });
        })
        .end(done);
    });
  });

  describe('GET', function () {
    // don't really need this since we have admin and user account by now...
    // var count = 5;
    // before('make some accounts', function (done) {
    //   function makeUser (credentials) {
    //     if (!credentials)
    //       credentials = makeCredentials();
    //     return new Promise(function (resolve, reject) {
    //       admin.agent
    //         .post('/user')
    //         .send(credentials)
    //         .end(function (err, res) {
    //           if (err) reject(err);
    //           resolve(res.body);
    //         });
    //     });
    //   }
    //   var promises = [];
    //   for (var i = 0; i < count; i++)
    //     promises.push(makeUser());
    //   Promise
    //     .all(promises)
    //     .then(function () {
    //       done();
    //     });
    // });
    describe('multiple', function () {
      it('admin can GET all users', function (done) {
        admin.agent
          .get('/user')
          .expect(function (res) {
            res.body.should.be.Array.with.length(2);
            // res.body.should.containEql(_.omit(admin.credentials, 'password'));
            res.body.should.containEql(_.omit(user.credentials, 'password'));
          })
          .end(done);
      });
      it('requires admin', function (done) {
        user.agent
          .get('/user')
          .expect(function (res) {
            res.body.should.eql({
              error: {
                message: 'Unauthorized',
              }
            });
          })
          .end(done);
      });
    });
    describe('single', function () {
      it('admin can GET single users', function (done) {
        admin.agent
          .get('/user/' + user.credentials._id)
          .expect(function (res) {
            res.body.should.eql(_.omit(user.credentials, 'password'));
          })
          .end(done);
      });
      it('requires admin', function (done) {
        user.agent
          .get('/user/' + admin.credentials._id)
          .expect(function (res) {
            res.body.should.eql({
              error: {
                message: 'Unauthorized',
              }
            });
          })
          .end(done);
      });
      it('users can GET themselves', function (done) {
        user.agent
          .get('/user/' + user.credentials._id)
          .expect(function (res) {
            user.credentials.should.containEql(res.body);
          })
          .end(done);
      });
    });
  });

  describe('FIND', function () {
    // GET /path?conditions={}&fields="field1 field 2"&options={"sort":{"field":-1}}
    it('admin can FIND users', function (done) {
      admin.agent
        .get('/user?conditions={"username":"' + user.credentials.username + '"}')
        .expect(function (res) {
          res.body.should.be.an.Array;
          res.body.should.containEql(_.omit(user.credentials, 'password'));
        })
        .end(done);
    });
    it('requires admin', function (done) {
      user.agent
        .get('/user?conditions={"username":"' + admin.credentials.username + '"}')
        .expect(function (res) {
          res.body.should.eql({
            error: {
              message: 'Unauthorized',
            }
          });
        })
        .end(done);
    });
  });

  describe('UPDATE', function () {
    it('admin can UPDATE users', function (done) {
      var email = faker.internet.email();
      admin.agent
        .put('/user/' + user.credentials._id)
        .type('urlencoded')
        .send({ email: email })
        .expect(function (res) {
          res.body.email.should.be.equal(email);
          user.credentials.email = email;
        })
        .end(done);
    });
    it('user can UPDATE themselves', function (done) {
      var name = faker.name.firstName();
      user.agent
        .put('/user/' + user.credentials._id)
        .type('urlencoded')
        .send({ name_first: name })
        .expect(function (res) {
          res.body.name_first.should.be.equal(name);
          user.credentials.name_first = name;
        })
        .end(done);
    });
    it('user can\'t UPDATE some protected properties', function (done) {
      // make ourselves an admin heh heh heh
      user.agent
        .put('/user/' + user.credentials._id)
        .type('urlencoded')
        .send({ type: 'admin' })
        .expect(function (res) {
          res.body.should.eql({
            error: {
              message: 'You are not authorized to write on field: type'
            }
          });
        })
        .end(done);
    });
  });

  describe('REMOVE', function () {
    it('admins can REMOVE user', function (done) {
      var user = makeCredentials();
      admin.agent
        .post('/user')
        .send(user)
        .end(function (err, res) {
          _.extend(user, _.omit(res.body, 'password'));
          admin.agent
            .del('/user/' + user._id)
            .expect(function (res) {
              res.body.should.eql(_.omit(user, 'password'));
            })
            .end(done);
        });
    });
  });
});

after('close database connection', function (done) {
  tangelo.mongoose.connection.close(function () {
    console.log('...finished!');
    done();
  });
});
