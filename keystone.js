// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('dotenv').load();

// Require keystone
var keystone = require('keystone');

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.
keystone.init({

	'name': 'Tangelo',
	// Showed on top left admin panel
	'brand': 'Tangelo',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',

	'host': process.env.IP || 'localhost',
	'port': process.env.PORT || 3000,
	'env': process.env.NODE_ENV || 'development',
	'cookie secret': process.env.cookie_secret || 'himitsu',

	'logger': process.env.loglevel || 'dev',

	// 'mongo': process.env.MONGO_URI || "mongodb://localhost/your-db",

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
	'locals': {
		_: require('lodash'),
		env: keystone.get('env'),
		utils: keystone.utils,
		editable: keystone.content.editable
	},

});

// Load your project's Models
keystone.import('models');

// Load your project's Routes
keystone.set('routes', require('./routes'));

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
	'users': 'users'
});

// Start Keystone to connect to your database and initialise the web server
keystone.start();
