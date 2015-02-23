var keystone = require('keystone');

exports = module.exports = function (req, res) {
  // this is needed instead of res.render('signin') to set the csrf form value correctly
  var view = new keystone.View(req, res);
  view.render('signin');
  // res.render('signin');
};
