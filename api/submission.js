var app = require('../tangelo');
var hooks = require('./hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');

// submissions that the clients can ...submit.
// you're going to always want to use PUT instead of POST for this I think?

// TODO - validation?
// TODO - created/modified

var schema = {
  // whose submission is this
  'owner': {
    'type': String,
    'required': true,
    'trim': true,
  },
  // what assignment was it for
  'number': {
    'type': Number,
    'required': true,
  },
  'createdAt': {
    'type': Date,
  },
  'content': {
    'type': String,
    'required': true,
  },
}

var service = feathersMongoose('submission', schema, app.mongoose);

function addOwner (hook, next) {
  hook.data.owner = hook.params.user._id;
  next();
}

_.extend(service, {
  before: {
    get: [hooks.requireSelfOrAdminSubmissions],
    find: [hooks.requireSelfOrAdminSubmissions],
    create: [hooks.requireSelfOrAdminSubmissions, hooks.addCreatedAt, addOwner],
    update: [hooks.requireSelfOrAdminSubmissions],
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
