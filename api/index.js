var app = require('../tangelo');

app.service('/user', require('./user'));
app.service('/uploads/', require('./files'));


/*
app.post('/upload', function(req, res) {
	console.log('Uploads');
	console.log( req.body );
	console.log( req.files );
	//res.status(204).end();
});

app.post('/upload', function(req, res) {
	var rstream = fs.createReadStream(dirname + '/' + path);
});
*/

app.post('/login', require('./auth/login'));
app.post('/logout', require('./auth/logout'));

// for debugging
app.all('/whoami', function (req, res) {
  res.json({
    user: req.user === void(0) ? 'nobody' : req.user
  });
});

app.use(function errorHandler (err, req, res, next) {
  console.log(err);
  res.json({
    error: err
  });
});
