var app = require('../app');
var _ = require('lodash');

app.service('/user', require('./services/user'));
app.service('/uploads', require('./services/files'));
app.service('/lesson', require('./services/lesson'));
app.service('/feedback', require('./services/feedback'));
app.service('/submission', require('./services/submission'));
app.get('/mysubmissions', function (req, res) {
  var submissions = app.service('submission');
  submissions.model
    .find()
    .populate('owner')
    .lean()
    .exec(function (err, submissions) {
      if (err) res.json({ error: { message: err } });
      submissions = _.filter(submissions, function (submission) {
        return submission.owner._id.toString() == req.user._id.toString();
      });
      for (var i = 0; i < submissions.length; i++)
        delete submissions[i].owner;
      res.send(submissions);
    })
});


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
