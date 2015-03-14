var app = require('../tangelo');

app.service('/user', require('./user'));

app.post('/login', require('./auth/login'));
app.post('/logout', require('./auth/logout'));

// for debugging
app.all('/whoami', function (req, res) {
  res.json({
    user: req.user === void(0) ? 'nobody' : req.user
  });
});
