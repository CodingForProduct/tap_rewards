// libraries that this app needs
var express = require('express');
var path = require('path');
var expressLayouts = require('express-ejs-layouts');
var data = require('./data/rider_data');

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

// display signup page
app.get('/signup', function (request, response) {
  response.render('signup');
});

// display login page
app.get('/login', function (request, response) {
  response.render('login');
});

// display password reset page
app.get('/resetpw', function (request, response) {
  response.render('resetpw');
});

// array of riders and rewards
var metroRiders = data.rider;
var metroRewards = data.reward;

// display dashboard - with rider data
app.get('/dashboard', function (request, response) {
	// pass data to template
	response.render('dashboard', {
		rider: metroRiders
	});
});

// display rewards page - reward options data
app.get('/rewards', function (request, response) {
 // pass data to template
	response.render('rewards', {
		reward: metroRewards
	});
});

app.get('/redeem',function(request,response){
	response.render('redeem',{
		oldbalance: metroRiders[0].pointBalance,
		newbalance: metroRiders[0].pointBalance-metroRewards[1].pointsRequired,
		reward: metroRewards[1]
	})
});

// start server on port
// app.listen(process.env.PORT, process.env.IP);

var port = process.env.PORT || 3000
app.listen(port, process.env.IP, function() {
console.log('server started on port 3000');
});
