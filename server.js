require('dotenv').load();

var feathers = require('feathers');
var feathersPassport = require('feathers-passport');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var connectMongo = require('connect-mongo');
var _ = require('lodash');

var app = feathers();


app.set('host', process.env.IP || 'localhost');
app.set('port', process.env.PORT || 80);
app.set('cookie secret', process.env.cookie_secret || 'himitsu');
app.set('cookie name', process.env.cookie_name || 'sid');
app.set('logger', process.env.loglevel || 'dev');
app.set('x-powered-by', false);

app.configure(feathers.rest());
app.configure(feathersPassport(function (defaults) {
  var MongoStore = connectMongo(defaults.createSession);
  return _.assign(defaults, {
    secret: app.get('cookie secret'),
    name: app.get('cookie name'),
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      db: 'sessions',
    }),
  });
}));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', feathers.static(__dirname + '/public', {
  index: 'base.html'
}));

require('./routes/')(app);

app.listen(app.get('port'), function () {
  console.log('Tangelo running on port %s', app.get('port'));
});
