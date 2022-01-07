const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const url = 'https://hp-video-conference.herokuapp.com';
// const url = 'http://localhost:3000';

passport.use(
  new LinkedInStrategy(
    {
      clientID: '78vgz183qkqpho',
      clientSecret: 'GFjVFRMbbWc4a1MI',
      callbackURL: `${url}/social/callback/linkedin`,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
