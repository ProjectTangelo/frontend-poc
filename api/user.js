var app = require('../tangelo');
var util = require('./util');
var hooks = require('./hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');


// TODO - validation
// TODO - filtering
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
    get: [hooks.selfModify],
    find: [hooks.requireAdmin],
    create: [hooks.requireAdmin],
    update: [hooks.requireAdmin],
    patch: [hooks.requireAdmin],
    remove: [hooks.requireAdmin],
  },
  after: {
  }
});
delete service.patch;

// USER ONLY CHANGE ITSELF (ASIDE FROM TYPE)
// USER GET ITSELF

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
