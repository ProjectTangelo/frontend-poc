var app = require('../tangelo');
var util = require('./util');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');


var schema = {
  username: String,
  password: String,
  email: String,
  isAdmin: Boolean,
}

var service = feathersMongoose('user', schema, app.mongoose);

_.extend(service, {
  findByUsername: function (username, callback) {
    return this.model.find({ username: username }, 'username password email', { limit: 1 }, callback);
  },
  // hooks
  before: {
    create: function (hook, next) {
      util.hash(hook.data.password, function (err, hash) {
        if (err) {
          return hook.callback('Error while hashing password');
        }
        hook.data.password = hash;
        next();
      });
    }
  },
});


exports = module.exports = service;

// {
//   find: function(params, callback) {},
//   get: function(id, params, callback) {},
//   create: function(data, params, callback) {},
//   update: function(id, data, params, callback) {},
//   patch: function(id, data, params, callback) {},
//   remove: function(id, params, callback) {},
//   setup: function(app) {}
// };
