class SiteController {
  index(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if(user) {
      res.redirect('/meet');
    } else {
      res.render('index');
    }
  }
}

module.exports = new SiteController();