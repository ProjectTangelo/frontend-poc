var app = require('../tangelo');

app.service('/user', require('./user'));

app.get('/uploads/:id', require('./uploads'));
app.service('/file', require('./file'));

app.service('/lesson', require('./lesson'));
app.service('/feedback', require('./feedback'));
app.service('/submission', require('./submission'));

// var FileService = require('./files');

/*
app.post('/upload', function(req, res) {
	console.log('Uploads');
	console.log( req.body );
	console.log( req.files );
	//res.status(204).end();
});
*/

app.post('/login', require('./auth/login'));
app.get('/logout', require('./auth/logout'));

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
