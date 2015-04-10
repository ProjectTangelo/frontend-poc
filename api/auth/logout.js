exports = module.exports = function (req, res) {
  req.logout();
  // always succeeds I guess
  // TODO - redirect?
  res.send({
    'success': req.user === null
  });
};
