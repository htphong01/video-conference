const axios = require('axios').default;

class MeetController {
  async index(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if(user) {
      if(user.provider === 'google') {
        user.avatar = user.photos[0].value;
      } else if(user.provider === 'facebook') {
        const url = `https://graph.facebook.com/v12.0/2010599445774520/picture?redirect=false&access_token=${user.token}`;
        const { data } = await axios.get(url);
        user.avatar = data?.data?.url;
      } else if(user.provider === 'linkedin') {
        user.avatar = user.photos[0].value;
      }
      res.render('meet', { user });
    } else {
      res.redirect('/');
    }
  }
}

module.exports = new MeetController();