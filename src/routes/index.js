const authRoute = require('./auth');
const meetRoute = require('./meet');
const siteRoute = require('./site');
const social = require('./social');

function routes(app) {
  app.use('/auth', authRoute);
  app.use('/meet', meetRoute);
  app.use('/social', social);
  app.use('/', siteRoute);
}

module.exports = routes;
