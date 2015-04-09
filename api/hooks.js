var _ = require('lodash');

exports = module.exports = {
  requireAdmin: function (hook, next) {
    // console.log('requireadmin', hook);
    if (!hook.params.user || hook.params.user.type !== 'admin') {
      return next({
        message: 'Unauthorized'
      });
    }
    next();
  },
  requireSelfOrAdminById: function (hook, next) {
    // console.log('requireselforadmin', hook);
    // TODO - create / patch
    if (!hook.params.user || (hook.params.user.type !== 'admin' && hook.id != hook.params.user._id)) {
      return next({
        message: 'Unauthorized'
      });
    }
    next();
  },
  filterRead: function (hook, next) {
    var user = hook.params.user.type;
    if (user !== 'admin') {
      // mongoose keeps its internal results on _doc
      var result = hook.result._doc;
      var permissions = this.permissions;
      result = _.pick(result, function (permission, field, obj) {
        return permissions[field] && permissions[field][user].read;
      });
      hook.result._doc = result;
    }
    next();
  },
  filterWrite: function (hook, next) {
    var user = hook.params.user.type;
    if (user !== 'admin') {
      var data = hook.data;
      for (var field in data) {
        if (!this.permissions[field] || !this.permissions[field][user] || !this.permissions[field][user].write) {
          return next({
            message: 'You are not authorized to write on field: ' + field
          });
        }
      }
    }
    next();
  },
  addCreatedAt: function (hook, next) {
    hook.data.createdAt = new Date();
    next();
  },
  requireSelfOrAdminByOwner: function (hook, next) {
    if (hook.params.user && hook.params.user.type === 'admin') {
      return next();
    }
    if (hook.params.query && hook.params.query.conditions && hook.params.query.conditions.owner && hook.params.query.conditions.owner == hook.params.user._id) {
      return next();
    }
    next({
      message: 'Unauthorized'
    });
  }
}
