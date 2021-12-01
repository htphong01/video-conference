const express = require('express');
const router = express.Router();
const passport = require('passport');

require('.././passport/google');
require('.././passport/facebook');
// Facebook
router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/callback/facebook', passport.authenticate('facebook', { failedRedirect: '/' }),
function(req, res) {
  res.redirect('/meet');
});

// Google
router.get('/auth/google',
passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/callback/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  function (req, res) {
    res.redirect('/meet');
  });

module.exports = router;
