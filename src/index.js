let express = require( 'express' );
let app = express();
let server = require( 'http' ).Server( app );
let io = require( 'socket.io' )( server );
let stream = require( './ws/stream' );
let path = require( 'path' );
let favicon = require( 'serve-favicon' );
const route = require('./routes');
const session = require('express-session');
const passport = require('passport');
const port = process.env.PORT || 3000 ;

app.use( favicon( path.join( __dirname, 'favicon.ico' ) ) );
app.use( '/assets', express.static( path.join( __dirname, 'assets' ) ) );

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'resources', 'views'));;

app.use(passport.initialize());
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

route(app);

io.of( '/stream' ).on( 'connection', stream );

server.listen(port,()=>{
  console.log("server listening to port "+port);
});
