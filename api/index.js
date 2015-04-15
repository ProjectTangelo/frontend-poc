var app = require('../app');
var _ = require('lodash');
var winston = require('winston');

app.service('/user', require('./services/user'));

app.get('/uploads/:id', require('./services/uploads'));
app.service('/file', require('./services/file'));

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


app.post('/login', require('./auth/login'));
app.get('/logout', require('./auth/logout'));

// for debugging
app.all('/whoami', function (req, res) {
  res.json({
    user: req.user === void(0) ? 'nobody' : req.user
  });
});

app.use(function errorHandler (err, req, res, next) {
  // winston.error(err);
  res.json({
    error: err
  });
});
