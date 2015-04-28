var tangelo = require('../app.js');

tangelo.service('user').createAdmin(function () {
  console.log('finished');
  process.kill();
});
