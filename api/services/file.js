var app = require('../../app');
var hooks = require('../hooks');
var feathersMongoose = require('feathers-mongoose');
var _ = require('lodash');

var schema = {
  'filename': {
    'type': String,
    'required': true,
  },
  'ext': {
    'type': String,
    'required': true,
  },
  'size': {
    'type': Number,
    'required': true,
  },
  'content': {
    'type': String,
    'required': true,
    'select': false,
  },
};


var service = feathersMongoose('file', schema, app.mongoose);

_.extend(service, {
  before: {
    get: [],
    find: [],
    create: [
      hooks.requireAdmin,
      function arrangeData (hook, next) {
        if (!hook.data && !hook.data.file) {
          return next({
            message: 'Missing file information.'
          });
        }
        var data = {
          filename: hook.data.file.originalname,
          ext: hook.data.file.extension,
          size: hook.data.file.size,
          content: hook.data.file.buffer.toString('base64'),
        };
        hook.data = data;
        next();
      }
    ],
    update: [hooks.requireAdmin],
    remove: [hooks.requireAdmin],
  },
  after: {
    get: [],
    find: [],
    create: [],
    update: [],
    remove: [],
  },
});

exports = module.exports = service;
