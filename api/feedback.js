var app = require('../tangelo');
var hooks = require('./hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');

// TODO - validation?

var schema = {
  'submission': {
    'type': String,
    'required': true,
    'ref': 'submission',
  },
  'content': {
    'type': String,
    'required': true,
  },
  'createdAt': {
    'type': Date,
  },
};

var service = feathersMongoose('feedback', schema, app.mongoose);

_.extend(service, {
  before: {
    get: [hooks.requireSelfOrAdminByOwner],
    find: [hooks.requireSelfOrAdminByOwner],
    create: [hooks.requireSelfOrAdminByOwner, hooks.addCreatedAt],
    update: [hooks.requireSelfOrAdminByOwner],
    remove: [hooks.requireAdmin],
  },
  after: {
    get: [],
    find: [],
    create: [],
    update: [],
    remove: [],
  }
});


exports = module.exports = service;
