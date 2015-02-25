var keystone = require('keystone');

exports = module.exports = function (req, res) {
  res.render('admin');
  // res.sendFile('/public/adminpanel.html', {}, function (err) {
  //   if (err) {
  //     res.status(err.status).end();
  //   }
  // })
};
