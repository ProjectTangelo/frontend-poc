require('dotenv').load();

var feathers = require('feathers');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var app = feathers();


app.set('host', process.env.IP || 'localhost');
app.set('port', process.env.PORT || 3000);
app.set('cookie secret', process.env.cookie_secret || 'himitsu');

app.set('logger', process.env.loglevel || 'dev');
app.set('view engine', 'jade');
app.set('x-powered-by', false);

app.configure(feathers.rest());

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended, true }));
app.use('/', feathers.static(__dirname));

app.listen(app.get('port'));
