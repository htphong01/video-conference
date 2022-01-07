const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const url = 'https://hp-video-conference.herokuapp.com';
const clientID =
  '131625507095-spirp6tgv3saptao0ula6lte5f429jhb.apps.googleusercontent.com';
const clientSecret = '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';
// const url = 'http://localhost:3000'
// const clientID = '878012101581-fnsia2i4l8umbe8jtp1oguoj9uobn30n.apps.googleusercontent.com';
// const clientSecret = 'Bn054a2L3NuSIlZy6opLDMAC';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  return done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: `${url}/social/callback/google`,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
