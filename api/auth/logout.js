
exports = module.exports = function (req, res) {
  req.logout();
  // always succeeds I guess
  res.send({
    'success': req.user === null
  });
};
