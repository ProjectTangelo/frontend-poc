var app = require('../tangelo');
var _ = require('lodash');

var route = function (req, res) {
  var file = app.service('file');
  var file_id = req.params.id; // shoullllld always be defined
  file.model
    .findOne({ _id: file_id })
    .select('content filename ext size')
    .lean()
    .exec(function (err, file) {
      if (err) {
        return res.status(500).json({
          error: {
            message: err.toString()
          }
        });
      }
      if (!file) {
        return res.status(404).json({
          error: {
            message: 'Not found'
          }
        });
      }
      // console.log('sending file ' + file.filename + '...');
      // console.log(file.content); // will be really long and make the request take forever to complete with larger files
      res.set('Content-Length', file.size);
      res.type(file.ext);
      res.send(new Buffer(file.content, 'base64'));
    });
}

exports = module.exports = route;
