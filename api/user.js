var app = require('../tangelo');
var util = require('./util');
var hooks = require('./hooks');
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
  },
}

var service = feathersMongoose('user', schema, app.mongoose);

_.extend(service, {
  findByUsername: function (username, callback) {
    return this.model.findOne({ 'username': username }, '-__v', callback);
  },
  // admin is inherently true/true
  // anything omitted is false
  permissions: {
    'username': {
      'user': {
        'read': true,
        'write': false
      }
    },
    'password': {
      'user': {
        'read': false,
        'write': true
      }
    },
    'email': {
      'user': {
        'read': true,
        'write': true
      }
    },
    'type': {
      'user': {
        'read': false,
        'write': false
      }
    },
    '_id': {
      'user': {
        'read': true,
        'write': false
      }
    }
  },
  before: {
    get: [hooks.requireSelfOrAdmin],
    find: [hooks.requireAdmin],
    create: [hooks.requireAdmin],
    update: [hooks.requireSelfOrAdmin, hooks.filterWrite],
    patch: [hooks.requireSelfOrAdmin, hooks.filterWrite],
    remove: [hooks.requireAdmin],
  },
  after: {
    get: [hooks.filterRead],
    find: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  }
});

// USER ONLY CHANGE ITSELF (ASIDE FROM TYPE AND USERNAME)
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
