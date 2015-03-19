require('dotenv').load();

var feathers = require('feathers');
var feathersPassport = require('feathers-passport');
var feathersHooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var connectMongo = require('connect-mongo');
var _ = require('lodash');
var multer = require('multer');

var app = this.app = feathers();

var passport = app.passport = require('passport');
var mongoose = app.mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/tangelo');

app.set('host', process.env.IP || 'localhost');
app.set('port', process.env.PORT || 80);
app.set('cookie secret', process.env.cookie_secret || 'himitsu');
app.set('cookie name', process.env.cookie_name || 'sid');
app.set('logger', process.env.loglevel || 'dev');
app.set('x-powered-by', false);
app.set('default admin username', process.env.admin_username || 'admin');
app.set('default admin password', process.env.admin_password || 'himitsu'); // will be hashed automatically
app.set('default admin email', process.env.admin_email || 'admin@admin.admin');

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '16mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '16mb' }));

app.configure(feathers.rest());
app.configure(feathersHooks());
app.configure(feathersPassport(function (defaults) {
  var MongoStore = connectMongo(defaults.createSession);
  return _.assign(defaults, {
    secret: app.get('cookie secret'),
    name: app.get('cookie name'),
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
    passport: passport
  });
}));
app.use('/', feathers.static(__dirname + '/public', {
  index: 'base.html'
}));

app.use('/uploads', feathers.static(__dirname + '/uploads'));
app.use(multer({
  dest: './uploads/',

}));

// Expose app for our APIs later
exports = module.exports = app;

// Initialize the APIs
require('./api/');

app.listen(app.get('port'), function () {
  console.log('Tangelo running on port %s', app.get('port'));
});

// Create default admin account
app.service('user').findByUsername(app.get('default admin username'), function (err, user) {
  if (err) {
    throw new Error('Error while trying to add default admin account', err);
  }
  if (!user) {
    console.log('Creating default admin user...');
    app.service('user').create({
      username: app.get('default admin username'),
      password: app.get('default admin password'),
      email: app.get('default admin email'),
      type: 'admin',
    }, {}, function (err, data) {
      if (err) {
        throw new Error('Error while creating default admin account', err);
      }
      console.log('...done! Here\'s your admin account information:\n', data);
    });
  }
  else {
    console.log('Hello! Here\'s your admin account information:\n', user);
  }
});
