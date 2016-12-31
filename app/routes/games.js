var express = require("express");
var Game = require("../models/game");
var User = require("../models/user");
var Tag = require("../models/tag");
var router = express.Router();
router.route('/')
    // This runs when you send a post request to /users
    .post(function(req, res, next) {
        var game = new Game();      // create a new game
        if (req.body) {
          game.start_time = Date.parse(req.body.start_time);  // set the start time to what they said
          game.end_time = Date.parse(req.body.end_time);  // set the end time to what they said
        }

        // save the user and check for errors
        game.save(function(err) {
            if (err) return next(err);

            res.status(201).json(Object.assign({ message: 'Game created'}, game.toJSON()));
        });
    })
    // List all games
    .get(function(req, res, next) {
        Game.find(function(err, games) {
            if (err) return next(err);

            res.json(games);
        });
    });

// All actions for a game
router.route('/:game_id')
    // Get the game
    .get(function(req, res, next) {
        // Find the game by its id
        Game.findById(req.params.game_id, function(err, game) {
            if (err) return next(err);
            res.json(game);
        });
    })
    // Edit the game
    .put(function(req, res, next) {
        Game.findById(req.params.game_id, function(err, game) {
            if (err) return next(err);

            game.start_time = Date.parse(req.body.start_time);  // Change their start time to whatever is requested
            game.end_time = Date.parse(req.body.end_time);  // Change their end time to whatever is requested

            // Save the game
            game.save(function(err) {
                if (err) return next(err);

                res.json(Object.assign({ message: 'Game times updated'}, game.toJSON()));
            });
        });
    })
    // Delete the game with this id
    .delete(function(req, res, next) {
        Game.findById(req.params.game_id, function(err, game) {
            Tag.remove({ _game: req.params.game_id }, function(err, tags) {
                if (err) return next(err);
                User.remove({$and: [{games: [game._id]}, {games: {$size: 1}}]}, function (err, n) {
                  if (err) return next(err);
                });
                User.update({_id: { $in: game.players }}, {$pullAll: {games: [game._id]}}, function (err, n) {
                  if (err) return next(err);
                });
                Game.remove({
                    _id: req.params.game_id
                }, function(err, game) {
                      if (err) return next(err);

                      res.json({ message: 'Game deleted' });
                });
            });
        });
    });
router.route('/:game_id/users')
    // When you want to create a user and attach them to your game
    .post(function(req, res, next) {
        Game.findById(req.params.game_id, function(err, game) {
            if (err) return next(err);

            var user = new User({ name: req.body.name, games: [game._id] });     // create a new user, set their name, add them to the game
            game.players.push(user._id);  // Add the user to the game

            // Save the game
            game.save(function(err) {
                if (err) return next(err);
            });

            // save the user and check for errors
            user.save(function(err) {
                if (err) return next(err);
                res.status(201).json(Object.assign({ message: 'User created and added to game'}, user.toJSON()));
            });
        });
    })
    // List all users in the game
    .get(function(req, res, next) {
        User.find({ games: req.params.game_id }, function(err, users) {
            if (err) return next(err);

            res.json(users);
        });
    });
router.route('/:game_id/tags')
    // When you want to find a tag shot in the game
    .get(function(req, res, next) {
        Game.findById(req.params.game_id, function(err, game) {
            Tag.find({ _game: req.params.game_id, _receiver: null }, function(err, tags) {
                if (err) return next(err);

                res.json(tags);
            });
        });
    });
router.route('/:game_id/tags/:tag_id')
    // When you want to find a tag shot in the game
    .get(function(req, res, next) {
        Tag.find({ _id: req.params.tag_id, _game: req.params.game_id, _receiver: null }, function(err, tag) {
            if (err) return next(err);

            res.json(tag);
        });
    });

module.exports = router;
