// //Command line to get the localhost running:
// cd C:\Users\harry.dye\Documents\S1V4
// nodemon
//
// Command line to get mongod working:
// cd C:\Program Files\MongoDB\Server\4.0\bin
// mongod.exe
//
// Command line to get mongo running and showing the database:
// cd C:\Program Files\MongoDB\Server\4.0\bin
// mongo
// use bookworm
// show collections
// db.users.find().pretty()

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var app = express();

//app.use is mainly middleware



//mongodb connection
mongoose.connect("mongodb://localhost:27017/bookworm");
var db = mongoose.connection;
//mongo error this connects to mongodb
db.on('error', console.error.bind(console, 'connection error:'));

//use session for tracking logins
//this requires the keyword secret, which is a string that is used to sign the session ID cookie
app.use(session({
  secret:'treehouse',
  //resave option forces the session to be saved in the session store
  resave:true,
  //saveUninitialized forces an uninitialized session to be saved in the session store
  saveUninitialized: false,
  //new key to store a new session of mongostore
  store: new MongoStore({
    mongooseConnection: db
  })
}));

//make the user id available to temptlates
app.use(function (req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
