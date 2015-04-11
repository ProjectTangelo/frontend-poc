var tangelo = require('../tangelo');

var welcome = function () {
  if (tangelo.get('loglevel') > 0) {
    console.log('Tangelo running on port %s', tangelo.get('port'));
  }
}


if (tangelo.get('SSL')) {
  var fs = require('fs');

  var credentials = {
    key: fs.readFileSync('AYY LMAO'),
    cert: fs.readFileSync('AYY L M A O'),
  };

  require('https')
    .createServer(credentials, tangelo)
    .listen(443, welcome);
}
else {
  require('http')
    .createServer(tangelo)
    .listen(tangelo.get('port'), welcome);
}
