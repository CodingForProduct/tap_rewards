// libraries that this app needs
var express = require('express');

// initialize app
var app = express();

// set the type of template that the app will use
app.set('view engine', 'ejs');

// display root route
app.get('/', function (request, response) {
  response.render('home');
});

// start server on port
app.listen(3000, function() {
  console.log('server started on port 3000');
});
