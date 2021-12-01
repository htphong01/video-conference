class AuthController {
  login (req, res, next) {
    res.send('Welcome');
  }

  logout(req, res, next) {
    req.session.destroy();
    res.redirect('/');
  }
}

module.exports = new AuthController();