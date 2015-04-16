var bcrypt = require('bcryptjs');

exports = module.exports = {
  hash: function (string, callback) {
    bcrypt.genSalt(function (err, salt) {
      if (err) {
        return callback(err);
      }
      bcrypt.hash(string, salt, function (err, hash) {
        if (err) {
          return callback(err);
        }
        return callback(null, hash);
      });
    })
  },
  matches: function (string, hash, callback) {
    return bcrypt.compare(string, hash, callback);
  }
}
