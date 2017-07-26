// libraries that this app needs
var express = require('express');
var expressLayouts = require('express-ejs-layouts');
var low = require('lowdb');
var path = require('path');
var bodyParser = require('body-parser');
var uuid = require('uuid');

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

// bodyParser reads a form's input and stores it in request.body
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies

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

// display dashboard - with rider data and rewards
app.get('/dashboard', function (request, response) {
	// pass data to template
  var rider = db.get('rider').value()
  var rewards = db.get('rewards').value()
  response.render('dashboard', {rider: rider, rewards: rewards})
});

// Click one reward that links to redeem page
//To demonstrate this, uncomment lines 14-22 in dashboard.ejs
//Works when form is not present and all rewards are displayed with a forEach loop
// app.get('/dashboard/:id', function(req, res) {
//   var reward = db.get('rewards').find({ id: req.params.id }).value()
//   var points;
//   if(reward) {
//     points = db.get('rewards').find({ id: reward.id }).value()
//   }
//   res.render('redeem', { reward: reward || {}, points: points || {}})
// })

//Select reward from form, update balance
//Display redemption and new balance on redeem page
app.post('/redeem', function(request, response) {
  // get reward type and reward points from form
  var reward = req.body.rewardType;
  var points = req.body.pointsRequired;
  //display user balance
  var balance = db.get('rider').value()
  var newBalance = balance - points;

  //update user balance
  db.get('rider')
  .find({ balance: balance })
  .assign({ newBalance: newBalance})
  .write()

  // redirect
  response.redirect('/redeem')
});

// display redeem page
app.get('/redeem',function(request,response){
	response.render('redeem')
});

// start server on port
app.listen(3000, function() {
  console.log('server started on port 3000');
});
