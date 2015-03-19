var app = require('./tangelo');

exports = module.exports = {
  requireAdmin: function (req, res, next) {
    if (req.user.type !== 'admin') {
      console.log('error! requires admin to access');
      return next('Admin required');
    }
    next();
  }
}
