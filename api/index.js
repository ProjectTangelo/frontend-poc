var app = require('../tangelo');

app.service('/user', require('./user'));
app.service('/uploads', require('./files'));
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
/*
app.get('/lesson/:id', function(req, res) {
  // var rstream = fs.createReadStream(dirname + '/' + path);
    FileService.get(req.params['id'], null, function(err, result){
      res.set('Content-Type', result.file.type);
      res.send( result.content );
    });
  // res.send( req.params['id'] );
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
