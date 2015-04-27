require('dotenv').load();

var feathers = require('feathers');
var feathersPassport = require('feathers-passport');
var feathersHooks = require('feathers-hooks');
var bodyParser = require('body-parser');
var multer = require('multer');
var morgan = require('morgan');
var connectMongo = require('connect-mongo');
var winston = require('winston');
var _ = require('lodash');
var app = this.app = feathers();

var passport = app.passport = require('passport');
var mongoose = app.mongoose = require('mongoose');
// maybe put this in an .init()
mongoose.connect('mongodb://localhost/tangelo');
mongoose.connection.on('error', function (err) {
  winston.debug(err);
});

app.set('host', process.env.IP || 'localhost');
app.set('port', process.env.PORT || 80);
app.set('db', process.env.DB || 'tangelo');
app.set('SSL', process.env.SSL || false);
app.set('cookie secret', process.env.cookie_secret || 'himitsu');
app.set('cookie name', process.env.cookie_name || 'sid');
app.set('loglevel', process.env.hasOwnProperty('LOGLEVEL') ? process.env.LOGLEVEL : 'debug');
app.set('x-powered-by', false);
app.set('view engine', 'jade');
app.set('views', process.cwd() + '/public/views');
app.set('default admin username', process.env.admin_username || 'admin');
app.set('default admin password', process.env.admin_password || 'himitsu'); // will be hashed automatically
app.set('default admin email', process.env.admin_email || 'admin@admin.admin');

winston.level = app.get('loglevel');

if (winston.levels[winston.level] <= winston.levels['debug'])
  app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '16mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '16mb' }));
app.use(multer({
  limits: {
    files: 1,
    fileSize: 16000000,
  },
  includeEmptyFields: true,
  inMemory: true,
}));
// populate body parameter if we're doing a file upload
app.use(function (req, res, next) {
  _.extend(req.body, req.files);
  next();
});

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

// Expose app
exports = module.exports = app;

// Initialize the APIs
require('./api/');

// Initialize routes
require('./routes');
