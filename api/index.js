var app = require('../tangelo');

app.service('/user', require('./user'));
app.service('/uploads', require('./files'));
app.service('/lesson', require('./lesson'));
app.service('/feedback', require('./feedback'));
app.service('/submission', require('./submission'));


app.post('/login', require('./auth/login'));
app.get('/logout', require('./auth/logout'));

// for debugging
app.all('/whoami', function (req, res) {
  res.json({
    user: req.user === void(0) ? 'nobody' : req.user
  });
});

app.use(function errorHandler (err, req, res, next) {
  // console.log(err);
  res.json({
    error: err
  });
});


// Create default admin account
// this shit needs to change
// app.mongoose.connection.on('open', function () {
//   app.service('user').findByUsername(app.get('default admin username'), function (err, user) {
//     if (err) {
//       throw new Error('Error while trying to add default admin account', err);
//     }
//     if (!user) {
//       console.log('Creating default admin user...');
//       app.service('user').createAdmin();
//     }
//     else {
//       console.log('Hello! Here\'s your admin account information:\n', user);
//     }
//   });
// });
