var app = require('./app');
var middleware = require('./middleware');
var feathers = require('feathers');

app.get('/', function (req, res) {
  if (req.user) {
    if (req.user.type === 'admin') {
      res.render('admin', req);
    }
    else {
      res.render('client', req);
    }
  }
  else {
    // TODO - csrf
    // res.render('login');
    res.sendFile(__dirname + '/public/login.html');
  }
});

app.use('/', feathers.static(__dirname + '/public'));

app.use('/admin', middleware.requireAdmin);
app.use('/admin', feathers.static(__dirname + '/public/app/admin'));

app.use('/uploads', feathers.static(__dirname + '/uploads'));
