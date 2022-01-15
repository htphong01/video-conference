const axios = require('axios').default;
const meetService = require('../services/MeetService');

class MeetController {
  async index(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if (user) {
      if (user.provider === 'google') {
        user.avatar = user.photos[0].value;
      } else if (user.provider === 'facebook') {
        const url = `https://graph.facebook.com/v12.0/2010599445774520/picture?redirect=false&access_token=${user.token}`;
        const { data } = await axios.get(url);
        user.avatar = data?.data?.url;
      } else if (user.provider === 'linkedin') {
        user.avatar = user.photos[0].value;
      }
      user.id = user.id || user._id;
      res.render('meet', { user });
    } else {
      res.redirect('/');
    }
  }

  async create(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    const creator = user.id || user._id;
    const result = await meetService.createNewMeet({ ...req.body, creator });
    res.json(result);
  }

  async show(req, res, next) {
    const result = await meetService.findRoomByRoomId(req.params.id);
    res.json(result);
  }

  whiteboard(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if (user) {
      res.render('whiteboard', { user });
    } else {
      res.redirect('/');
    }
  }

  async invite(req, res, next) {
    const result = await meetService.invite(req.body);
    res.json(result);
  }

  async checkOwner(req, res, next) {
    const result = await meetService.checkOwner(req.body);
    res.json(result);
  }

  async update(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if (user) {
      const userId = user.id || user._id;
      const result = await meetService.update(userId, req.body);
      res.json(result);
    } else {
      res.json({ success: false, message: 'Invalid user' });
    }
  }


}

module.exports = new MeetController();
