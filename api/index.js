var app = require('../tangelo');
var requireDirectory = require('require-directory');
var routes = requireDirectory(module);

// console.log('ayy', routes.user);

app.service('/user', routes.user);

app.post('/login', routes.auth.login);
app.post('/logout', routes.auth.logout);

// for debugging
app.all('/whoami', function (req, res) {
  res.json({
    user: req.user === void(0) ? 'nobody' : req.user
  });
});
