var keystone = require('keystone');
var _ = require('lodash');

exports = module.exports = {
  get: function (req, res) {
    var defaults = {
      offset: 0,
      limit: 25,
    }
    var options = _.defaults(req.query, defaults);
    var users = keystone.list('users');
    users.paginate({
      page: options.offset / options.limit,
      perPage: options.limit
    }).exec(function (err, results) {
      res.send(results);
    });
  }
}
