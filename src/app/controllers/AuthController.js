class AuthController {
  login (req, res, next) {
    res.send('Welcome');
  }
}

module.exports = new AuthController();