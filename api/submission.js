var app = require('../tangelo');
var feedback = app.service('feedback');

var hooks = require('./hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');


// TODO - validation?

var schema = {
  // whose submission is this
  'owner': {
    'type': String,
    'required': true,
    'ref': 'user'
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
  'feedback': [{
    'type': String,
    'ref': 'feedback',
  }]
};

var service = feathersMongoose('submission', schema, app.mongoose);

function addOwner(hook, next) {
  hook.data.owner = hook.params.user._id;
  next();
}

_.extend(service, {
  find: function (params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    var query = this.parseQuery(params.query);

    this.model
      .find(query.conditions, query.fields, query.options)
      .populate('owner')
      .populate('feedback')
      .exec(callback);
  },
  get: function (id, params, callback) {
    if (typeof params === 'function') {
      callback = params;
      params = {};
    }
    var query = this.parseQuery(params.query);

    this.model
      .findById(id, query.fields, query.options)
      .populate('owner')
      .populate('feedback')
      .exec(callback);
  },
  before: {
    get: [hooks.requireSelfOrAdminByOwner],
    find: [hooks.requireSelfOrAdminByOwner],
    create: [hooks.requireSelfOrAdminByOwner, hooks.addCreatedAt, addOwner],
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
