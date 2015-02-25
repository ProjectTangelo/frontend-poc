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
        res.cookie(keystone.get('cookie name'), userToken, {
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
      // console.log(err, user);
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
  function render (template) {
    var view = new keystone.View(req, res);
    view.render(template);
  }

  // check that csrf is legit
  if (!keystone.security.csrf.validate(req)) {
    console.log('csrf error');
    req.flash('error', 'There was an error with your request, please try again.');
    return render('signin');
  }
  // check that they inputted the required login information
  if (!req.body.username || !req.body.password) {
    req.flash('error', 'Please enter your login information.');
    return render('signin');
  }
  // log in
  signin(req.body, req, res, function(user) {
    if (req.query.from && req.query.from.match(/^(?!http|\/\/|javascript).+/))
      return res.redirect(req.query.from);

    if (typeof keystone.get('signin redirect') === 'string')
      return res.redirect(keystone.get('signin redirect'));

    if (typeof keystone.get('signin redirect') === 'function')
      return keystone.get('signin redirect')(user, req, res);

    return res.redirect('/admin');
  }, function() {
    req.flash('error', 'Sorry, that login information not valid.');
    return render('signin');
  });
}
