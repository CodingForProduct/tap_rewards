// Requiring expressJS
var express = require ('express');
var app = express();


// Setting port - Let Heroku set the port |or| Assign "8080" as the port if Heroku can not set the port
var port = process.env.PORT || 8080


// Allows "static" items in application (e.g. html, images, css, etc) to run in the "dirname" variable 
    // The "dirname" evaluates to the folder name / path)
app.use(express.static(__dirname));


// setting up routes (e.g. webpage URL are routes) 
    // The [/] represents the end of URL
    // Function: After URL is input (indentifying end of link to trigger this), have the response render the index.html (homepage) back
app.get("/", function(req, res) {
    res.render("index")
})


// Assign server to listen to requests 
    // (e.g When you go to a URL, you are "requesting info" from it. 
    // The server "listens" to the request and resonds by showing you the appropriate code to render that page/request
    // Listen at this port (assigned above to run)
app.listen(port, function() {
    console.log("Hello friend! The Tap Rewards app is running")
})