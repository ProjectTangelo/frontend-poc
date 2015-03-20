var app = require('./tangelo');
var middleware = require('./middleware');
var feathers = require('feathers');

// app.use('/admin', middleware.requireAdmin);
app.use('/', feathers.static(__dirname + '/public'));
app.use('/admin', feathers.static(__dirname + '/public', {
  index: 'base.html'
}));

app.use('/uploads', feathers.static(__dirname + '/uploads'));