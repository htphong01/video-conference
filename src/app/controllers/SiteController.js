class SiteController {
  index(req, res, next) {
    const user = req.session?.passport?.user;
    if(user) {
      res.redirect('/meet');
    } else {
      res.render('index');
    }
  }
}

module.exports = new SiteController();