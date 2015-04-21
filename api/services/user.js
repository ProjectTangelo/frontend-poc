var app = require('../../app');
var util = require('../util');
var hooks = require('../hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');


// TODO - validation - https://www.npmjs.com/package/mongoose-validator
// TODO - pagination - someday . . .

var schema = {
  'username': {
    'type': String,
    'required': true,
    'trim': true,
    'unique': true,
  },
  'name_first': {
    'type': String,
    'trim': true,
    'default': '',
  },
  'name_last': {
    'type': String,
    'trim': true,
    'default': '',
  },
  'password': {
    'type': String,
    'required': true,
    'trim': true,
    'select': false,
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
  'node_id': {
    'type': String,
    'trim': true,
    'lowercase': true,
    'default': '',
  },
  'container_id': {
    'type': String,
    'trim': true,
    'lowercase': true,
    'default': '',
  },
};

var service = feathersMongoose('user', schema, app.mongoose);

_.extend(service, {
  findByUsername: function (username, callback) {
    return this.model.findOne({ 'username': username }, '+password', callback);
  },
  // TODO - make less ugly
  createAdmin: function (callback) {
    var admin = new this.model({
      username: app.get('default admin username'),
      password: app.get('default admin password'),
      email: app.get('default admin email'),
      type: 'admin',
    }).save(function (err, data) {
      if (err) {
        throw new Error('Error while creating default admin account', err);
      }
      if (callback) callback();
    });
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
    'name_first': {
      'user': {
        'read': true,
        'write': true
      }
    },
    'name_last': {
      'user': {
        'read': true,
        'write': true
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
    get: [hooks.requireSelfOrAdminById],
    find: [hooks.requireAdmin],
    create: [hooks.requireAdmin],
    update: [hooks.requireSelfOrAdminById, hooks.filterWrite],
    remove: [hooks.requireAdmin],
  },
  after: {
    get: [hooks.filterRead],
    find: [],
    create: [],
    update: [hooks.filterRead],
    remove: [],
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
