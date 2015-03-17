


var sendError = function (error) {

}

exports = module.exports = {
  requireAdmin: function (hook, next) {
    console.log(hook);
    if (!hook.params.user || hook.params.user.type !== 'admin') {
      return next({
        message: 'Admin required'
      });
    }
    next();
  },
  selfModify: function (hook, next) {
    console.log(hook);
    if (hook.callback.name === 'deserialized') {
      return next();
    }
    if (!hook.params.user) {
      return next({
        message: 'User required'
      });
    }
    // if (hook.params.user.type === 'user' && )
  }
}
