const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const url = 'https://hp-video-conference.herokuapp.com'

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

// make facebook strategy
passport.use(new facebookStrategy({
  clientID: '217654370261575',
  clientSecret: '6dd55bf694c483bef960a9c194c1f7da',
  callbackURL: `${url}/social/callback/facebook`,
}, function(token, refreshToken, profile, done) {
  profile.token = token;
  return done(null, profile);
}));