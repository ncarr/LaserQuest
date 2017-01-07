var express = require("express");
var Game = require("../models/game");
var User = require("../models/user");
var Tag = require("../models/tag");
var Router = require("./filteredrouter");
var base = require("./base");
var router = express.Router({mergeParams: true});
router.post("/", function (req, res, next) {
    req.body.start_time = Date.parse(req.body.start_time);
    req.body.end_time = Date.parse(req.body.end_time);
    next();
});
router.put("/", function (req, res, next) {
    req.body.start_time = Date.parse(req.body.start_time);
    req.body.end_time = Date.parse(req.body.end_time);
    next();
});
router = Router(Game, router);
router.route('/:id/users')
    // When you want to create a user and attach them to your game
    .post(function(req, res, next) {
      Game.createUser({ _id: req.params.id, _location: req.params.location_id }, { name: req.body.name }, function (err, user) {
        if (err) return next(err);

        res.status(201).json(Object.assign({ message: 'User created and added to game'}, user.toJSON()));
      });
    })
    // List all users in the game
    .get(function(req, res, next) {
        req.filters.games = req.params.id;
        base.listRoute(User)(req, res, next);
    });
router.route('/:id/tags')
    // When you want to find a tag that was shot in the game, but did not hit anyone
    .get(function(req, res, next) {
      req.filters = { _game: req.params.id, _receiver: null };
      base.listRoute(Tag)(req, res, next);
    });
router.route('/:id/tags/:tag_id')
    // When you want to find a tag that was shot in the game, but did not hit anyone
    .get(function(req, res, next) {
      req.filters = { _game: req.params.id, _receiver: null };
      base.readRoute(Tag)(req, res, next);
    });

module.exports = router;
