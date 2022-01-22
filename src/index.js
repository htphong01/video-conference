let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io')(server);
var methodOverride = require('method-override');
let stream = require('./ws/stream');
let path = require('path');
let favicon = require('serve-favicon');
const route = require('./routes');
const session = require('express-session');
const passport = require('passport');
const { connect } = require('./config/database');
const { urlencoded } = require('express');
const port = process.env.PORT || 3000;

app.use(methodOverride('_method'));
app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'resources', 'views'));

app.use(urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);

route(app);

connect();

io.of('/stream').on('connection', stream);

server.listen(port, () => {
  console.log('server listening to port ' + port);
});
