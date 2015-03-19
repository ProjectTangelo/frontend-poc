var app = require('../tangelo');

app.service('/user', require('./user'));
app.service('/uploads/', require('./files'));




app.post('/login', require('./auth/login'));
app.post('/logout', require('./auth/logout'));

// for debugging
app.all('/whoami', function (req, res) {
  res.json({
    user: req.user === void(0) ? 'nobody' : req.user
  });
});

app.use(function errorHandler (err, req, res, next) {
  res.json({
    error: err
  });
});
