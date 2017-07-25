// libraries that this app needs
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var low = require('lowdb');
var path = require('path');

// initialize app
var app = express();

// connect to database
// path.join will take the parameters and create a path using the
// right type of slashes (\ vs /) based on the operatin system
const db = low(path.join('data', 'riderData.json'));

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

// display - landing page
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

// display dashboard - with rider data amd rewards
app.get('/dashboard', function (request, response) {
	// pass data to template
  var rider = db.get('rider').value()
  var rewards = db.get('rewards').value()
  var points = db.get('rewards').value()
  response.render('dashboard', {rider: rider, rewards: rewards, points: points,})
});

app.get('/redeem',function(request,response){
	response.render('redeem',{
		oldbalance: metroRiders[0].pointBalance,
		newbalance: metroRiders[0].pointBalance-metroRewards[1].pointsRequired,
		reward: metroRewards[1]
	})
});

// start server on port
app.listen(3000, function() {
  console.log('server started on port 3000');
});
