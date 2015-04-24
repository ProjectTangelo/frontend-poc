var app = require('../../app');
var feedback = app.service('feedback');

var hooks = require('../hooks');
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
    'default': 0,
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
  // retard hack for demo
  // var users = app.service('user');
  // users.model
  //   .findOne({ username: hook.data.username })
  //   .lean()
  //   .exec(function (err, user) {
  //     if (err) return next({ message: err });
  //     if (!user) return next({ message: 'Unknown username' });
  //     hook.data.owner = user._id;
  //     delete hook.data.username;
  //     next();
  //   });
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
    get: [],
    find: [],
    create: [hooks.addCreatedAt, addOwner],
    update: [addOwner],
    remove: [hooks.requireAdmin],
  },
  after: {
    get: [function authenticate (hook, next) {
      if (hook.params.user.type === 'admin')
        return next();
      if (hook.params.user._id.toString() === hook.result.owner._id.toString())
        return next();
      next({
        message: 'Unauthorized',
      });
    }],
    find: [function filter (hook, next) {
      if (hook.params.user.type !== 'admin' && hook.result) {
        hook.result = _.filter(hook.result, function (submission) {
          return submission.owner._id.toString() === hook.params.user._id.toString();
        });
      }
      next();
    }],
    create: [],
    update: [],
    remove: [],
  },
});


exports = module.exports = service;
