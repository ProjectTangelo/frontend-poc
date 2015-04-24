var app = require('../../app');
var hooks = require('../hooks');
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

// now this is callback hell
function addToSubmission (hook, next) {
  // console.log("ADD TO SUBMISSION HOOK", hook);
  var submission = app.service('submission');
  submission.model.findById(hook.data.submission, function (err, submission) {
    var feedback_id = hook.result._doc._id;
    if (err) {
      return next({
        message: err.toString()
      });
    }
    if (!submission) {
      service.remove(feedback_id, function (err, data) {
        if (err) {
          return next({
            message: err.toString()
          });
        }
        next({
          message: 'No submission with that ID found.'
        });
      });
    }
    submission.feedback.addToSet(feedback_id);
    submission.save(function (err, data) {
      if (err) {
        return next({
          message: err.toString()
        });
      }
      next();
    });
  });
}

function removeFromSubmission (hook, next) {
  // console.log("REMOVE FROM SUBMISSION HOOK", hook);
  var submission = app.service('submission');
  submission.model.findById(hook.result._doc.submission, function (err, submission) {
    if (err) {
      return next({
        message: err.toString()
      });
    }
    var feedback_id = hook.id;
    submission.feedback.pull(feedback_id);
    submission.save(function (err, data) {
      if (err) {
        return next({
          message: err.toString()
        });
      }
      next();
    })
  });
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
      .populate('submission')
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
      .populate('submission')
      .exec(callback);
  },
  before: {
    get: [],
    find: [],
    create: [hooks.requireSelfOrAdminByOwner, hooks.addCreatedAt],
    update: [hooks.requireSelfOrAdminByOwner],
    remove: [hooks.requireAdmin],
  },
  after: {
    get: [function authorize (hook, next) {
      if (!hook.result)
        return next();
      if (hook.params.user.type === 'admin')
        return next();
      if (hook.result.submission.owner.toString() === hook.params.user._id.toString())
        return next();
      next({
        message: 'Unauthorized',
      });
    }],
    find: [function filter (hook, next) {
      if (hook.params.user.type !== 'admin' && hook.result) {
        hook.result = _.filter(hook.result, function (feedback) {
          return feedback.submission.owner.toString() === hook.params.user._id.toString();
        });
      }
      next();
    }],
    create: [addToSubmission],
    update: [],
    remove: [removeFromSubmission],
  }
});


exports = module.exports = service;
