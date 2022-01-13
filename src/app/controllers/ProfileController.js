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

}

module.exports = new ProfileController();