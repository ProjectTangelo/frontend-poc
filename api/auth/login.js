var app = require('../../tangelo');
var passport = app.passport;
var util = require('../util');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function(user, callback) {
  // console.log('serializeuser', user);
  callback(null, user._id);
});

passport.deserializeUser(function(id, callback) {
  // console.log('deserializeuser', id);
  app.service('user').model.findById(id, '_id username type email', {}, function (err, data) {
      callback(err, data);
  });
});


passport.use(new LocalStrategy(function (username, password, callback) {
  // console.log('hello from localstrategy', username, password);
  app.service('user').findByUsername(username, function (err, user) {
    // console.log(err, user);
    if (err) {
      return callback(err);
    }
    if (!user) {
      return callback(null, false, {
        message: 'User ' + username + ' not found'
      });
    }
    util.matches(password, user.password, function (err, matches) {
      // console.log(err, matches);
      if (err) {
        return callback(err);
      }
      if (!matches) {
        return callback(null, false, {
          message: 'Incorrect password'
        });
      }
      callback(null, user);
    });
  });
}));


exports = module.exports = function (req, res) {
  var sendError = function (error) {
    res.json({
      'error': error
    });
  }

  if (req.user) {
    return sendError({
      message: 'You are already logged in'
    });
  }

  passport.authenticate('local', function (err, user, info) {
    // console.log('hello from authenticate', err, user, info);

    if (err) {
      return sendError(info);
    }
    if (!user) {
      return sendError(info);
    }
    req.login(user, function (err) {
      // console.log('hello from login', err);
      if (err) {
        return sendError(err.toString());
      }
      return res.json({
        'success': user.username
      });
    });
  })(req, res);
};
