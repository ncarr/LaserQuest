// Set up our .env file
require("dotenv").config();
// This dependency is for sending data back when people try to load websites or register tags
var express = require("express");
var app = express();

// This sets up the server to interpret tags and format pages
app.set('view engine', 'ejs');
// This sets up the server to work on port 8080 if you don't specify
var port = process.env.PORT || 8080;

// This routes data to the proper locations
var router = express.Router();

app.use("/console", require("./console/server"));
app.use("/", express.static("public"));

app.listen(port);
console.log('API currently running at http://localhost:' + port);
