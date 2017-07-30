var router = require('express').Router();
var low = require('lowdb');
var path = require('path');
var uuid = require('uuid');
var authService = require('./services/authService');
var passport = require('passport');
authService.configurePassport(passport)

// connect to database
// path.join will take the parameters and create a path using the
// right type of slashes (\ vs /) based on the operatin system
var db = low(path.join('data', 'riderData.json'));

//==========================
// root route
//==========================
// display - landing page
router.get('/', function (req, res) {
  res.render('welcome');
});

//==========================
// reward routes
//==========================
// display dashboard - with rider data and rewards
router.get('/dashboard', function (req, res) {
	// pass data to template
  var rider = db.get('riders').find({ username: 'Alice Green' }).value()
  var reward = db.get('rewards').value()
  res.render('dashboard', {rider: rider, reward: reward })
});

// Select reward from form, update balance
// Redirect to redeem page to display redemption and new balance message
router.post('/dashboard', function(req, res) {
    console.log(req.body)
    // get data from form/dashboard page
    var pointsMinus = req.body.pointsRequired;
    var currentBalance = req.body.pointBalance;
    var id = req.body.pointID;

    //update user balance
    db.get('riders')
      .find({ username: 'Alice Green' })
      .assign({ pointBalance: currentBalance - pointsMinus })
      .write()
// redirect
  res.redirect('redeem' + '/' + id)
});

// display one reward on redeem page, using ":id"
router.get('/redeem/:pointID', function(req, res) {
    var rider = db.get('riders').find({ username: 'Alice Green' }).value()
    var reward = db.get('rewards').find({ pointID: req.params.pointID }).value()
  res.render('redeem', { reward: reward || {}, rider: rider || {},})
})
//==========================
// auth routes
//==========================

var signup_view_path = path.join('auth', 'signup');
var login_view_path = path.join('auth', 'login');

// display signup page
// router.get('/signup', function (req, res) {
//   res.render(signup_view_path, { errors: [] })
// });
router.get('/signup', function(req, res) {
  res.render(signup_view_path)
})

// create user
router.post('/signup', function(req, res) {
  // remove extra spaces
  var username = req.body.username.trim();
  var password = req.body.password.trim();
  var password2 = req.body.password2.trim();
  var tapCard = req.body.tapCard.trim();
  var email = req.body.email.trim();
console.log(username)

// validate form data
  req.checkBody('username', 'Username must have at least 3 characters').isLength({min: 3});
  req.checkBody('password', 'Password must have at least 3 characters').isLength({min: 3});
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Confirm password is required').notEmpty();
  req.checkBody('password', 'Password do not match').equals(password2);

  // check for errors
  var errors = req.validationErrors();
  // if there are errors, display signup page
  if (errors) {
    return res.render(signup_view_path, {errors: errors.map(function(error) {return error.msg})})
  }

  var options = {
    username: username,
    password: password,
    tapCard: tapCard,
    email: email,
    successRedirectUrl: '/dashboard',
    signUpTemplate: signup_view_path,
  }
  authService.signup(options,res);
})

// display login page
router.get('/login', function (req, res) {
  // res.render('login');
  res.render(login_view_path, { errors: [] })
});

// peform login
router.post(
  '/login',
  passport.authenticate(
    'local',
    {
      successRedirect:'/dashboard',
      failureRedirect:'/login',
    }
  )
)

// display logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/')
})

// display password reset page
router.get('/resetpw', function (req, res) {
  res.render('resetpw');
});

module.exports = router;
