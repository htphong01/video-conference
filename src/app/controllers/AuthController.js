const authService = require('../services/AuthService');
class AuthController {
  async login (req, res, next) {
    const result = await authService.login(req.body.email, req.body.password);
    if(result.success) req.session.user = result.user;
    res.json(result);
  }

  logout(req, res, next) {
    req.session.destroy();
    res.redirect('/');
  }

  async register(req, res, next) {
    const result = await authService.createNewUser(req.body.displayName, req.body.email, req.body.password);
    if(result.success) req.session.user = result.user;
    res.json(result);
  }
}

module.exports = new AuthController();