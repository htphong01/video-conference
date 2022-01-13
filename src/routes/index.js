const authRoute = require('./auth');
const meetRoute = require('./meet');
const siteRoute = require('./site');
const socialRoute = require('./social');
const profileRoute = require('./profile');

function routes(app) {
  app.use('/auth', authRoute);
  app.use('/profile', profileRoute);
  app.use('/meet', meetRoute);
  app.use('/social', socialRoute);
  app.use('/', siteRoute);
}

module.exports = routes;
