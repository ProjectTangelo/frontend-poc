var app = require('../tangelo');
var hooks = require('./hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');

// lesson plans that the admin adds and the clients can view

// TODO - validation?
// TODO - created/modified

var schema = {
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
  }
}

var service = feathersMongoose('lesson', schema, app.mongoose);

_.extend(service, {
  before: {
    get: [],
    find: [],
    create: [hooks.requireAdmin, hooks.addCreatedAt],
    update: [hooks.requireAdmin],
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
