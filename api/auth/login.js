'use strict';

var app = require('../../app');
var passport = app.passport;
var util = require('../util');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');


passport.serializeUser(function(user, callback) {
  callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
  app.service('user').model.findById(id, '', {}, function (err, data) {
      callback(err, data);
  });
});


passport.use(new LocalStrategy(function (username, password, callback) {
  // console.log('hello from localstrategy', username, password);
  app.service('user').findByUsername(username, function (err, user) {
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(null, false, {
        message: 'User ' + username + ' not found',
      });
    }
    util.matches(password, user.password, function (err, matches) {
      if (err) {
        return callback(err);
      }
      if (!matches) {
        return callback(null, false, {
          message: 'Incorrect password',
        });
      }
      callback(null, user);
    });
  });
}));


exports = module.exports = function (req, res) {
  function sendError (error) {
    res.json({
      'error': error
    });
  }

  if (req.user) {
    return sendError({
      message: 'You are already logged in',
    });
  }

  passport.authenticate('local', function (err, user, info) {

    if (err) {
      return sendError(err.toString());
    }
    if (!user) {
      return sendError(info);
    }
    req.login(user, function (err) {
      if (err) {
        return sendError(err.toString());
      }
      return res.json({
        'success': _.omit(user._doc, 'password'),
      });
    });
  })(req, res);
};
