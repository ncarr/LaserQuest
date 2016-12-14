var express = require("express");
var User = require("../models/user");
var Game = require("../models/game");
var Tag = require("../models/tag");
var router = express.Router();
router.route('/')
    // This runs when you send a post request to /users
    .post(function(req, res) {
        var user = new User({ name: req.body.name });      // create a new user and set their name

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
router.route('/:user_id')
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
router.route("/:user_id/games")
    // List all games the user has played
    .get(function(req, res) {
        Game.find({ players: req.params.user_id }, function(err, games) {
            if (err)
                res.send(err);

            res.json(games);
        });
    });
router.route("/:user_id/games/:game_id")
    // Add an existing user to an existing game
    .post(function(req, res) {
        User.findById(req.params.user_id, function (err, user) {
            Game.findById(req.params.game_id, function(err, game) {
                if (err)
                    res.send(err);

                game.players.push(user._id);  // Add the user to the game
                user.games.push(game._id); // Add the game to the user

                // Save the user
                game.save(function(err) {
                    if (err)
                        res.send(err);
                });
            });
            // save the user and check for errors
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json(Object.assign({ message: 'User added to game'}, user.toJSON()));
            });
        });
    })
    .delete(function(req, res) {
        User.update({_id: req.params.user_id}, {$pull: {games: req.params.game_id}}, function (err, n) {
          if (err)
              res.send(err);

          Game.update({_id: req.params.game_id}, {$pull: {players: req.params.user_id}}, function (err, n) {
            if (err)
                res.send(err);

            res.json({ message: 'User removed from game'});
          });
        });
    });
router.route("/:user_id/tags")
    .get(function(req, res) {
        Tag.find({$or: [{_sender: req.params.user_id }, {_receiver: req.params.user_id}]}, function(err, tag) {
            if (err)
                res.send(err);

            res.json(tag);
        })
    });
router.route("/:user_id/tags/outgoing")
    // Create a tag, it may or may not reach anyone
    .post(function(req, res) {
        var tag = new Tag({ _sender: req.params.user_id, time: req.body.time });      // create a new tag and set the time

        // save the tag and check for errors
        tag.save(function(err) {
            if (err)
                res.send(err);

            res.json(Object.assign({ message: 'Tag uploaded'}, tag.toJSON()));
        });
    })
    .get(function(req, res) {
        Tag.find({ _sender: req.params.user_id }, function(err, tag) {
            if (err)
                res.send(err);

            res.json(tag);
        })
    });
router.route("/:user_id/tags/incoming")
    .get(function(req, res) {
        Tag.find({ _receiver: req.params.user_id }, function(err, tag) {
            if (err)
                res.send(err);

            res.json(tag);
        })
    })
    // You were tagged and want to upload it
    .post(function(req, res) {
        Tag.findById(req.body.tag_id, function (err, tag) {
            tag._receiver = req.params.user_id;

            // save the tag and check for errors
            tag.save(function(err) {
                if (err)
                    res.send(err);

                res.json(Object.assign({ message: 'Successfully tagged'}, tag.toJSON()));
            });
        });
    });
module.exports = router;
