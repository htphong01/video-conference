const profileService = require('../services/ProfileService');
const meetService = require('../services/MeetService');

class ProfileController {

  // [GET] /profile
  async index(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if (user) {
      const creator = user.id || user._id;
      const result = await meetService.getAllMeetOfUser(creator);
      res.render('profile', { user, meets: result?.meets || [] });
    } else {
      res.redirect('/');
    }
  }

  async update(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if (user) {
      const userId = user.id || user._id;
      const result = await profileService.update(userId, req.body);
      res.json(result);
    } else {
      res.json({ success: false, message: 'Invalid user' });
    }
  }

}

module.exports = new ProfileController();