const userService = require('../services/UserService');
class AuthController {
  login (req, res, next) {
    res.send('Welcome');
  }

  logout(req, res, next) {
    req.session.destroy();
    res.redirect('/');
  }

  async register(req, res, next) {
    const result = await userService.createNewUser(req.body.email, req.body.password);
    res.json(result);
  }
}

module.exports = new AuthController();