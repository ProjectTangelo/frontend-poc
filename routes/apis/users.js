var keystone = require('keystone');
var _ = require('lodash');

var users = keystone.list('users');
function sendError(err) {
  res.json({
    error: err
  });
}

exports = module.exports = {
  'get': function (req, res) {
    var defaults = {
      // offset: 0,
      limit: 25,
    };
    var options = _.defaults(req.query, defaults);
    users
      // .paginate({
      //   page: Math.ceil(options.offset / options.limit),
      //   perPage: options.limit
      // })
      .model.find()
      .limit(options.limit)
      .exec(function (err, results) {
        if (err) {
          res.status(500).json({
            error: err
          });
        }
        res.json(results);
      });
  },
  'create': function (req, res) {
    var item = new users.model();
    var updateHandler = item.getUpdateHandler(req);
    var data = {
      username: req.query.username,
      name: req.query.name,
      email: req.query.email,
      password: req.query.password,
      password_confirm: req.query.password
    };

    if (users.nameIsInitial) {
      if (users.nameField.validateInput(data)) {
        users.nameField.updateItem(item, data);
      } else {
        updateHandler.addValidationError(users.nameField.path, 'Name is required.');
      }
    }

    updateHandler.process(data, {
      flashErrors: true,
      logErrors: true,
      fields: users.initialFields
    }, function (err) {
      if (err) {
        return res.json({
          success: false,
          err: err
        });
      } else {
        return res.json({
          success: true,
          name: users.getDocumentName(item, true),
          id: item.id
        });
      }
    });
  },
  'update': function (req, res) {
    var id = req.query.id;
    if (!id)
      sendError('Missing ID field.');

    var data = req.query;
    delete data.id;

    users.model.findById(id).exec(function (err, item) {
      if (err)
        return sendError('database error', err);
      if (!item)
        return sendError('not found');

      item.getUpdateHandler(req).process(data, {
        flashErrors: true,
        logErrors: true
      }, function(err) {
        if (err) {
          return sendError(err);
        }
        return res.json({
          success: true,
          item: item
        });
      });
    });


  },
  'delete': function (req, res) {
    if (users.get('nodelete'))
      return sendError('List is set to "nodelete".');

    var id = req.query.id;

    if (id === req.user.id)
      return sendError('You can not delete yourself');

    users.model.findById(id).exec(function (err, item) {
      if (err)
        return sendError('database error', err);
      if (!item)
        return sendError('not found');

      item.remove(function (err) {
        if (err)
          return sendError('database error', err);

        return res.json({
          success: true,
          count: 1
        });
      });
    });
  }
}
