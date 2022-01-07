class SiteController {
  index(req, res, next) {
    const user = req.session?.passport?.user || req.session?.user;
    if (user) {
      res.redirect('/meet');
    } else {
      res.render('index');
    }
  }

  uploadFile(req, res, next) {
    if (req.file) {
      res.json({
        success: true,
        file: req.file,
      });
    } else {
      res.json({
        success: false,
      });
    }
  }
}

module.exports = new SiteController();
