exports = module.exports = {
  requireAdmin: function (req, res, next) {
    if (req.user.type !== 'admin') {
      return next('Unauthorized');
    }
    next();
  }
}
