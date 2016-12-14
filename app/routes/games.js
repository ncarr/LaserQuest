var express = require("express");
var Game = require("../models/game");
var User = require("../models/user");
var Tag = require("../models/tag");
var router = express.Router();
router.route('/')
    // This runs when you send a post request to /users
    .post(function(req, res) {
        var game = new Game();      // create a new game
        game.start_time = req.body.start_time;  // set the start time to what they said
        game.end_time = req.body.end_time;  // set the end time to what they said

        // save the user and check for errors
        game.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Game created', _id: game._id, start_time: req.body.start_time, end_time: req.body.end_time, __v: game.__v });
        });
    })
    // List all games
    .get(function(req, res) {
        Game.find(function(err, games) {
            if (err)
                res.send(err);

            res.json(games);
        });
    });

// All actions for a game
router.route('/:game_id')
    // Get the game
    .get(function(req, res) {
        // Find the game by its id
        Game.findById(req.params.game_id, function(err, game) {
            if (err)
                res.send(err);
            res.json(game);
        });
    })
    // Edit the game
    .put(function(req, res) {
        Game.findById(req.params.game_id, function(err, game) {
            if (err)
                res.send(err);

            game.start_time = req.body.start_time;  // Change their start time to whatever is requested
            game.end_time = req.body.end_time;  // Change their end time to whatever is requested

            // Save the game
            game.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Game times updated', _id: game._id, start_time: req.body.start_time, end_time: req.body.end_time, __v: game.__v });
            });
        });
    })
    // Delete the game with this id
    .delete(function(req, res) {
        Game.findById(req.params.game_id, function(err, game) {
            Tag.remove({
                _sender: { $in : game.players }
            }, function(err, tags) {
                if (err)
                    res.send(err);

                User.update({_id: { $in: game.players }}, {$pullAll: {games: [game._id]}}, function (err, n) {
                  if (err)
                      res.send(err);
                });
                Game.remove({
                    _id: req.params.game_id
                }, function(err, game) {
                      if (err)
                          res.send(err);

                      res.json({ message: 'Game deleted' });
                });
            });
        });
    });
router.route('/:game_id/users')
    // When you want to create a user and attach them to your game
    .post(function(req, res) {
        Game.findById(req.params.game_id, function(err, game) {
            if (err)
                res.send(err);

            var user = new User({ name: req.body.name, games: [game._id] });     // create a new user, set their name, add them to the game
            game.players.push(user._id);  // Add the user to the game

            // Save the game
            game.save(function(err) {
                if (err)
                    res.send(err);
            });

            // save the user and check for errors
            user.save(function(err) {
                if (err)
                    res.send(err);
                res.json(Object.assign({ message: 'User created and added to game'}, user.toJSON()));
            });
        });
    })
    // List all users in the game
    .get(function(req, res) {
        User.find({ games: req.params.game_id }, function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });
router.route('/:game_id/tags')
    // When you want to find a tag shot in the game
    .get(function(req, res) {
        Game.findById(req.params.game_id, function(err, game) {
            Tag.find({ _sender: { $in : game.players }, _receiver: null }, function(err, tags) {
                if (err)
                    res.send(err);

                res.json(tags);
            });
        });
    });
router.route('/:game_id/tags/:tag_id')
    // When you want to find a tag shot in the game
    .get(function(req, res) {
        Tag.findById(req.params.tag_id, function(err, tag) {
            if (err)
                res.send(err);

            res.json(tag);
        });
    });

module.exports = router;
