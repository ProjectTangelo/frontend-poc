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
    app.service('user').get(id, {}, callback);
});


passport.use(new LocalStrategy(function (username, password, callback) {
  console.log('hello from localstrategy', username, password);

  // callback hell, you say? Too bad. Maybe promises later...
  app.service('user').findByUsername(username, function (err, user) {
    // console.log(err, user);
    if (err) {
      return callback(err);
    }
    if (user.length === 0) {
      return callback(null, false, {
        message: 'User ' + username + ' not found'
      });
    }
    if (user.length > 1) {
      console.warn('Multiple users found with the same username (should never happen): ' + user);
    }
    user = user[0];

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
  function sendError(error) {
    res.json({
      'error': error
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
        'success': user
      });
    });
  })(req, res);
};
