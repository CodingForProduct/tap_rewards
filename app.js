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
  var rider = db.get('riders').find({ name: 'Alice Green' }).value()
  var reward = db.get('rewards').value()
  // var pointid = db.get('rewards').value()
  response.render('dashboard', {rider: rider, reward: reward })
});

// Select reward from form, update balance
// Redirect to redeem page to display redemption and new balance message
  app.post('/dashboard', function(request, response) {
    console.log(request.body)
    // get data from form/dashboard page
    var pointsMinus = request.body.pointsRequired;
    var currentBalance = request.body.pointBalance;
    var id = db.get('rewards').find({ pointID: request.body.pointID }).value();
    // var id = request.body.pointID;

    //update user balance
    db.get('riders')
      .find({ name: 'Alice Green' })
      .assign({ pointBalance: currentBalance - pointsMinus })
      .write()
// redirect
  response.redirect('redeem' + '/' + id)
});

// display one reward on redeem page, using ":id"
  // app.get('/redeem/:id', function(request, response) {
  app.get('/redeem/:pointID', function(request, response) {
    var rider = db.get('riders').find({ name: 'Alice Green' }).value()
    var reward = db.get('rewards').find({ pointID: request.params.pointID }).value()
    // var points;
    // if(reward) {
    //   points = db.get('rewards').find({ pointID: reward.pointsRequired }).value()
    // }
  // response.render('redeem', { reward: reward || {}, points: points || {}, rider: rider || {},})
  response.render('redeem', { reward: reward || {}, rider: rider || {},})
})


// start server on port
app.listen(3000, function() {
  console.log('server started on port 3000');
});
