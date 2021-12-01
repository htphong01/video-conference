const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const url = 'https://hp-video-conference.herokuapp.com';
const clientID = '2997899053806903';
const clientSecret = '9415e8308f22b91217d55787f5dd6acd';
// const url = 'http://localhost:3000'
// const clientID = '217654370261575';
// const clientSecret = '6dd55bf694c483bef960a9c194c1f7da';

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

// make facebook strategy
passport.use(new facebookStrategy({
  clientID: clientID,
  clientSecret: clientSecret,
  callbackURL: `${url}/social/callback/facebook`,
}, function(token, refreshToken, profile, done) {
  profile.token = token;
  return done(null, profile);
}));