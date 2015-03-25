var app = require('./tangelo');
var middleware = require('./middleware');
var feathers = require('feathers');

app.get('/', function (req, res) {
  res.render('index');
  // res.send('homepage');
});
app.use('/', feathers.static(__dirname + '/public'));

app.use('/admin', middleware.requireAdmin);
app.use('/admin', feathers.static(__dirname + '/public/app/admin'));

app.use('/uploads', feathers.static(__dirname + '/uploads'));
