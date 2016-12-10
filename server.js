// Import our dependencies
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
var User = require("./app/models/user");

// This routes data to the proper locations
var router = express.Router();
router.use(function(req, res, next) {
    console.log('Request received');
    next(); // make sure we go to the next routes and don't stop here
});
router.get('/', function(req, res) {
    res.json({message: 'Welcome to the Laser Quest API'});
});
router.route('/users')
    // This runs when you send a post request to /users
    .post(function(req, res) {
        var user = new User();      // create a new user
        user.name = req.body.name;  // set the user's name to whatever you requested

        // save the user and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created', _id: user._id, name: req.body.name, __v: user.__v });
        });
    })
    // List all users
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

    // All actions for an individual user
    router.route('/users/:user_id')
        // Get the user
        .get(function(req, res) {
            // Find the user by their id
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);
                res.json(user);
            });
        })
        // Edit the user
        .put(function(req, res) {
            User.findById(req.params.user_id, function(err, user) {
                if (err)
                    res.send(err);

                user.name = req.body.name;  // Change their name to whatever is requested

                // Save the user
                user.save(function(err) {
                    if (err)
                        res.send(err);

                    res.json({ message: 'User updated', _id: user._id, name: req.body.name, __v: user.__v });
                });
            });
        })
        // Delete the user with this id
        .delete(function(req, res) {
            User.remove({
                _id: req.params.user_id
            }, function(err, user) {
                if (err)
                    res.send(err);

                res.json({ message: 'User deleted' });
            });
        });

// all of our routes will be prefixed with /api/v1
app.use('/api/v1', router);

app.listen(port);
console.log('API currently running at http://localhost:' + port + '/api/v1');
