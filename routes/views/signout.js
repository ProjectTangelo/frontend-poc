var keystone = require('keystone');

exports = module.exports = function (req, res) {

  res.clearCookie('keystone.uid');
  req.user = null;

  req.session.regenerate(function () {
    if (typeof keystone.get('signout redirect') === 'string') {
      return res.redirect(keystone.get('signout redirect'));
    }
    if (typeof keystone.get('signout redirect') === 'function') {
      return keystone.get('signout redirect')(req, res);
    }
    return res.redirect('/keystone');
  });
};
