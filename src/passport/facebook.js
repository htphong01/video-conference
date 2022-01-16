const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
let url = '',
  clientID = '',
  clientSecret = '';
const environment = process.env.NODE_ENV;
if (environment === 'production') {
  url = 'https://hp-video-conference.herokuapp.com';
  clientID = '2997899053806903';
  clientSecret = '9415e8308f22b91217d55787f5dd6acd';
} else if (environment === 'development') {
  url = 'http://localhost:3000';
  clientID = '217654370261575';
  clientSecret = '6dd55bf694c483bef960a9c194c1f7da';
}

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

// make facebook strategy
passport.use(
  new facebookStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: `${url}/social/callback/facebook`,
    },
    function (token, refreshToken, profile, done) {
      profile.token = token;
      return done(null, profile);
    }
  )
);
