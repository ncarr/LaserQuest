// Import our dependencies
// Set up our .env file
require("dotenv").config();
// This dependency is for sending data back when people try to load websites or register tags
var express = require("express");
var app = express();
// This dependency is for interpreting tag data
var bodyParser = require("body-parser");
var jwt = require("jsonwebtoken");
var serviceAccount = require(process.env.FIREBASE_KEY);
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);

// This sets up the server to interpret tags and format pages
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// This sets up the server to work on port 8080 if you don't specify
var port = process.env.PORT || 8080;

// This routes data to the proper locations
var router = express.Router();
// We make sure you are actually allowed to use the data
router.use(function(req, res, next) {
    console.log('Request received');
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    console.log(token);
    // decode token
    if (token) {
      // verifies secret and checks expiry
      jwt.verify(token, process.env.FIREBASE_PUBLIC_KEY, {algorithm: "RS256"}, function(err, decoded) {
        if (err) {
          console.log(err);
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next(); // make sure we go to the next routes and don't stop here
        }
      });
    } else {
      // if there is no token
      // return an error
      return res.status(403).send({
          success: false,
          message: 'No token provided.'
      });
    }
});
router.get('/', function(req, res) {
    res.json({message: 'Welcome to the Laser Quest API'});
});

// all of our api routes will be prefixed with /api/v1
app.use('/api/v1', router);
app.use("/api/v1/games", require("./app/routes/games"));
app.use("/api/v1/users", require("./app/routes/users"));

app.use("/console", require("./console/server"));
app.use("/", express.static("public"));

app.listen(port);
console.log('API currently running at http://localhost:' + port + '/api/v1');
