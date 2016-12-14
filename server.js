// Import our dependencies
// Set up our .env file
require("dotenv").config();
// This dependency is for sending data back when people try to load websites or register tags
var express = require("express");
var app = express();
// This dependency is for interpreting tag data
var bodyParser = require("body-parser");

// This sets up the server to interpret tags
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// This sets up the server to work on port 8080 if you don't specify
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
var Game = require("./app/models/game");
var Tag = require("./app/models/tag");

// This routes data to the proper locations
var router = express.Router();
router.use(function(req, res, next) {
    console.log('Request received');
    next(); // make sure we go to the next routes and don't stop here
});
router.get('/', function(req, res) {
    res.json({message: 'Welcome to the Laser Quest API', data: 'none'});
});

// all of our routes will be prefixed with /api/v1
app.use('/api/v1', router);
app.use("/api/v1/games", require("./app/routes/games"));
app.use("/api/v1/users", require("./app/routes/users"));

app.listen(port);
console.log('API currently running at http://localhost:' + port + '/api/v1');
