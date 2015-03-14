var app = require('../tangelo');
var util = require('./util');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');


// TODO - validation
var schema = {
  'username': {
    'type': String,
    'required': true,
    'trim': true,
    'unique': true,
  },
  'password': {
    'type': String,
    'required': true,
    'trim': true,
    // 'select': false
  },
  'email': {
    'type': String,
    'trim': true,
    'lowercase': true,
    'default': '',
  },
  'type': {
    'type': String,
    'trim': true,
    'lowercase': true,
    'default': 'user',
    'enum': ['admin', 'user'],
  }
}

var service = feathersMongoose('user', schema, app.mongoose);

_.extend(service, {
  findByUsername: function (username, callback) {
    return this.model.findOne({ 'username': username }, '-__v', callback);
  },
  // hooks
  before: {
    find: function (hook, next) {
      console.log(hook);
      next();
    }
  },
  after: {
  }
});


service.schema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) {
    return next();
  }
  util.hash(user.password, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
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
