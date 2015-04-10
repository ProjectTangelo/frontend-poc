require('dotenv').load();

var feathers = require('feathers');
var feathersPassport = require('feathers-passport');
var feathersHooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var connectMongo = require('connect-mongo');
var _ = require('lodash');

var app = this.app = feathers();

var passport = app.passport = require('passport');
var mongoose = app.mongoose = require('mongoose');

app.set('host', process.env.IP || 'localhost');
app.set('port', process.env.PORT || 80);
app.set('db', process.env.DB || 'tangelo');
app.set('cookie secret', process.env.cookie_secret || 'himitsu');
app.set('cookie name', process.env.cookie_name || 'sid');
app.set('loglevel', process.env.LOGLEVEL || 'dev');
app.set('x-powered-by', false);
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/public/views');
app.set('default admin username', process.env.admin_username || 'admin');
app.set('default admin password', process.env.admin_password || 'himitsu'); // will be hashed automatically
app.set('default admin email', process.env.admin_email || 'admin@admin.admin');

mongoose.connect('mongodb://localhost/' + app.get('db'));

if (app.get('loglevel') !== '0') app.use(morgan(app.get('loglevel'))); // such one-liners #wow
app.use(bodyParser.json({ limit: '16mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '16mb' }));

app.configure(feathers.rest(function (req, res) {
  res.format({
    'text/plain': function () {
      res.send(res.data);
    },

    'default': function () {
      res.json(res.data);
    }
  });
}));
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

// Expose app
exports = module.exports = app;

// Initialize the APIs
require('./api/');

// Initialize routes
require('./routes');

app.listen(app.get('port'), function () {
  console.log('Tangelo running on port %s', app.get('port'));
});
