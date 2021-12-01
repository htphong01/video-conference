const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const url = 'https://hp-video-conference.herokuapp.com'

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

passport.use(new GoogleStrategy({
    clientID: '878012101581-fnsia2i4l8umbe8jtp1oguoj9uobn30n.apps.googleusercontent.com',
    clientSecret: 'Bn054a2L3NuSIlZy6opLDMAC',
    callbackURL: `${url}/social/callback/google`
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));