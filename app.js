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
  var riders = db.get('riders').value()
  var rewards = db.get('rewards').value()
  response.render('dashboard', {riders: riders, rewards: rewards})
});

// create a new reward
// app.post('/createReward', function(req, res) {
  // get data from form
  // var rewardType = req.body.rewardType;
  // var pointsRequired = req.body.pointsRequired;

  // insert new reward into database
    // db.get('rewards')
    //   .push({rewardType: rewardType, pointsRequired: pointsRequired, id: uuid()})
    //   .write()

  // redirect
  //     res.redirect('redeem')
  // })

// Select reward from form, update balance
// Redirect to redeem page to display redemption and new balance message
  app.post('/redeem', function(request, response) {
    // get data from form/dashboard page
    // var rewardType = request.body.rewardType;
    // var pointsRequired = request.body.pointsRequired;
    // var id = request.params.id;
    // var newBalance = pointBalance - pointsRequired;

    //update user balance
    db.get('riders')
      .find({ name: 'Alice Green' })
      .assign({ pointBalance: 550-20 })
      .write()

// redirect
  response.redirect('redeem')
});

// display one reward on redeem page, using ":id" - works for linked list, but not for Form submission; but not able to display rider name and points on redeem page
  app.get('/dashboard/:id', function(request, response) {
    var reward = db.get('rewards').find({ id: request.params.id }).value()
    var points;
    var rider = db.get('riders').find({ name: request.params.name }).value()
    var balance;
    if(reward) {
      points = db.get('rewards').find({ id: reward.pointsRequired }).value()
    }
    // if(balance) {
    //   balance = db.get('riders').find({ name: request.params.pointBalance }).value()
    // }
    response.render('redeem', { reward: reward || {}, points: points || {}, rider: rider || {}, balance: balance || {}})
  })

// display one reward on redeem page - seems to only work for Form submission, but not able to add "/:id" to display each reward and its points on the redeem page; also not showing rider name and points on the redeem page
  app.get('/redeem', function(request, response){
    var reward = db.get('rewards').find({ id: request.params.id }).value()
    var points;
    var rider = db.get('riders').find({ name: request.params.name }).value()
    var balance;
    if(reward) {
      points = db.get('rewards').find({ id: reward.pointsRequired }).value()
    }
    // if(balance) {
    //   balance = db.get('riders').find({ name: request.params.pointBalance }).value()
    // }
    response.render('redeem', { reward: reward || {}, points: points || {}, rider: rider || {}, balance: balance || {}})
 });

// start server on port
app.listen(3000, function() {
  console.log('server started on port 3000');
});
