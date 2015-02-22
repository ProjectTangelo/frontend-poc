var keystone = require('keystone');
var crypto = require('crypto');
var scmp = require('scmp');


/**
 * Creates a hash of str with Keystone's cookie secret.
 * Only hashes the first half of the string.
 */
function hash (str) {
  // force type
  str = '' + str;
  // get the first half
  str = str.substr(0, Math.round(str.length / 2));
  // hash using sha256
  return crypto
    .createHmac('sha256', keystone.get('cookie secret'))
    .update(str)
    .digest('base64')
    .replace(/\=+$/, '');

}

/**
 * Signs in a user user matching the login filters
 *
 * @param {Object} login - must contain email and password
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} onSuccess callback, is passed the User instance
 * @param {function()} onFail callback
 */
function signin (login, req, res, onSuccess, onFail) {
  if (login === void(0)) {
    return onFail(new Error('session.signin requires a User ID or Object as the first argument'));
  }
  var User = keystone.list(keystone.get('user model'));
  var doSignin = function (user) {
    req.session.regenerate(function () {
      req.user = user;
      req.session.userId = user.id;
      // if the user has a password set, store a persistence cookie to resume sessions
      if (keystone.get('cookie signin') && user.password) {
        var userToken = user.id + ':' + hash(user.password);
        res.cookie('keystone.uid', userToken, {
          signed: true,
          httpOnly: true
        });
      }
      onSuccess(user);
    });
  }
  User.model
    .findOne({
        'name': login.name
      })
    .exec(function (err, user) {
      if (user) {
        return user._.password.compare(login.password, function (err, isMatch) {
          if (!err && isMatch) {
            return doSignin(user);
          }
          return onFail(err);
        });
      }
      return onFail(err);
    });
}



exports = module.exports = function (req, res) {

  // check that csrf is legit
  if (!keystone.security.csrf.validate(req)) {
    req.flash('error', 'There was an error with your request, please try again.');
    return keystone.render(req, res, 'signin', {
      submitted: req.body
    });
  }
  // check that they inputted the required login information
  else if (keystone.get('login-requireables').reduce(function (prev, name) {
      return prev && req.body[name];
    }, true)) {
    req.flash('error', 'Please enter your login information.');
    return keystone.render(req, res, 'signin', {
      submitted: req.body
    });
  }
  // log in
  else {
    signin(req.body, req, res, function(user) {
      if (req.query.from && req.query.from.match(/^(?!http|\/\/|javascript).+/)) {
        return res.redirect(req.query.from);
      }
      if (typeof keystone.get('signin redirect') === 'string') {
        return res.redirect(keystone.get('signin redirect'));
      }
      if (typeof keystone.get('signin redirect') === 'function') {
        return keystone.get('signin redirect')(user, req, res);
      }
      return res.redirect('/keystone');
    }, function() {
      req.flash('error', 'Sorry, that login information not valid.');
      return keystone.render(req, res, 'signin', {
        submitted: req.body
      });
    });
  }
}

return;

/**
 * Middleware to ensure session persistence across server restarts
 *
 * Looks for a userId cookie, and if present, and there is no user signed in,
 * automatically signs the user in.
 *
 * @param {Object} req - express request object
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

exports.persist = function (req, res, next) {

  var User = keystone.list(keystone.get('user model'));
  if (!req.session) {
    console.error('\nKeystoneJS Runtime Error:\n\napp must have session middleware installed. Try adding "express-session" to your express instance.\n');
    process.exit(1);
  }

  if (keystone.get('cookie signin') && !req.session.userId && req.signedCookies['keystone.uid'] && req.signedCookies['keystone.uid'].indexOf(':') > 0) {
    var _next = function () {
      next();
    }; // otherwise the matching user is passed to next() which messes with the middleware signature
    exports.signin(req.signedCookies['keystone.uid'], req, res, _next, _next);

  }
  else if (req.session.userId) {

    User.model.findById(req.session.userId)
      .exec(function (err, user) {

        if (err) {
          return next(err);
        }

        req.user = user;
        next();

      });

  }
  else {
    next();
  }

};

/**
 * Middleware to enable access to Keystone
 *
 * Bounces the user to the signin screen if they are not signed in or do not have permission.
 *
 * req.user is the user returned by the database. It's type is Keystone.List.
 *
 * req.user.canAccessKeystone denotes whether the user has access to the admin panel.
 * If you're having issues double check your user model. Setting `canAccessKeystone` to true in
 * the database will not be reflected here if it is virtual.
 * See http://mongoosejs.com/docs/guide.html#virtuals
 *
 * @param {Object} req - express request object
 * @param req.user - The user object Keystone.List
 * @param req.user.canAccessKeystone {Boolean|Function}
 * @param {Object} res - express response object
 * @param {function()} next callback
 */

exports.keystoneAuth = function (req, res, next) {

  if (!req.user || !req.user.canAccessKeystone) {
    var from = new RegExp('^\/keystone\/?$', 'i')
      .test(req.url) ? '' : '?from=' + req.url;
    return res.redirect(keystone.get('signin url') + from);
  }

  next();

};
