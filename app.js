// libraries that this app needs
var express = require('express');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');

// initialize app
var app = express();


// add layout support
app.use(expressLayouts);
// specifiy location of layout file
app.set('layout', path.join(__dirname, 'views', 'layouts', 'layout'));


// set the type of template that the app will use
app.set('view engine', 'ejs');

// set the directory for the templates
app.set('views', path.join(__dirname, 'views'));

// set the folder for  static assets
app.use(express.static(path.join(__dirname, 'public')));

// display root route - landing page
app.get('/', function (request, response) {
  response.render('welcome');
});

// display login page
app.get('/login', function (request, response) {
  response.render('login');
});

//display dashboard
app.get('/dashboard', function (request, response) {
  response.render('dashboard');
});

// start server on port
app.listen(3000, function() {
  console.log('server started on port 3000');
});
