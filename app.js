// libraries that this app needs
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var store = require('connect-nedb-session')(session);
require('./config/environment')
var flash = require('connect-flash');
var routes = require('./routes');
var path = require('path');

// initialize app
var app = express();

// set the type of template that the app will use
app.set('view engine', 'ejs');

// add layout support
app.use(expressLayouts);

// specifiy location of layout file
app.set('layout', path.join(__dirname, 'views', 'layouts', 'layout'));

// set the directory for the templates
app.set('views', path.join(__dirname, 'views'));

// set the folder for  static assets
app.use(express.static(path.join(__dirname, 'public')));

// bodyParser reads a form's input and stores it in request.body
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

// form and url validation
app.use(expressValidator());

// cookie, session, passport is for authentication
app.use(cookieParser());

// setup sessions
var sessionOptions = {
  store: new store({ filename: path.join('data', 'sessionFile.json')}),
  secret: 'thisshouldbechanged',
  cookie: {},
  resave: false,
  saveUninitialized: false,
}
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies for https
}
app.use(session(sessionOptions))

// intialize passport
app.use(passport.initialize());
// use express.session() before passport.session()
app.use(passport.session());

// initialize flash; flash must be after cookieParser and session
app.use(flash());

// global variables that are available to the views
app.use(function(req, res, next) {
  res.locals.errors = null;
  // req.user comes from passport. this makes 'user' available in the view.
res.locals.user = req.user || null;
// req.flash comes from flash
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next();
  next();
})

// routes
app.use('/', routes);

// start server on port
// app.listen(process.env.PORT, process.env.IP);
//var port = process.env.PORT || 3000
app.listen(3000, function() {
console.log('server started on port 3000');
});
