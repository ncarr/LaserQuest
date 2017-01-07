var User = require("../models/user");
var Game = require("../models/game");
var Tag = require("../models/tag");
var base = require("./base");
var Router = require("./filteredrouter");
var router = Router(User);
router.route("/:id/games")
    // List all games the user has played
    .get(function(req, res, next) {
        req.filters.players = req.params.id;
        Game.listRoute(req, res, next);
    });
router.route("/:id/games/:game_id")
    // Add an existing user to an existing game
    .put(function(req, res, next) {
        User.addGame(Object.assign({ _id: req.params.id }, (req.filters || {})), Object.assign({ _id: req.params.id }, (req.filters || {})), function (err, user) {
          if (err) return next(err);

          res.json(Object.assign({ message: 'User added to game'}, user.toJSON()));
        });
    })
    // Remove an existing user from an existing game
    .delete(function(req, res, next) {
      User.removeGame(Object.assign({ _id: req.params.id }, (req.filters || {})), Object.assign({ _id: req.params.id }, (req.filters || {})), function (err) {
          if (err) return next(err);

          res.json({ message: "User removed from game" });
      });
    });
router.route("/:id/tags")
    // List all tags
    .get(function(req, res, next) {
        req.filters = {$or: [{_sender: req.params.id }, {_receiver: req.params.id}]};
        base.listRoute(Tag)(req, res, next);
    });
router.route("/:id/tags/outgoing")
    // List all tags you sent
    .get(function(req, res, next) {
        req.filters._sender = req.params.id;
        base.listRoute(Tag)(req, res, next);
    });
router.route("/:id/tags/incoming")
    // List all tags you were hit by
    .get(function(req, res, next) {
        req.filters._receiver = req.params.id;
        base.listRoute(Tag)(req, res, next);
    });
router.route("/:id/games/:game_id/tags")
    // List all tags in a game
    .get(function(req, res, next) {
        req.filters = {$or: [{_sender: req.params.id }, {_receiver: req.params.id}], _game: req.params.game_id};
        base.listRoute(Tag)(req, res, next);
    });
router.route("/:id/games/:game_id/tags/outgoing")
    // Create a tag, it may or may not reach anyone
    .post(function(req, res, next) {
        req.body.time = Date.parse(req.body.time);
        req.body._sender = req.params.id;
        req.body._game = req.params.game_id;
        base.createRoute(Tag)(req, res, next);
    })
    // List all tags you sent in a game
    .get(function(req, res, next) {
        req.filters = { _sender: req.params.id, _game: req.params.game_id };
        base.listRoute(Tag)(req, res, next);
    });
router.route("/:id/games/:game_id/tags/incoming")
    // List all tags you were hit by in a game
    .get(function(req, res, next) {
        req.filters = { _receiver: req.params.id, _game: req.params.game_id };
        base.listRoute(Tag)(req, res, next);
    });

// Check all of the sensor-specific incoming tag routes to ensure the sensors actually exist
router.use("/:id/games/:game_id/tags/incoming/:sensor", function (req, res, next) {
    if (req.params.sensor == "front" || req.params.sensor == "back" || req.params.sensor == "shoulder") {
        next();
    } else {
        var err = new Error("Sensor does not exist");
        err.name = "LaserQuestError";
        next(err);
    }
});
router.route("/:id/games/:game_id/tags/incoming/:sensor")
    // List all tags you were hit by on a specific sensor in a game
    .get(function(req, res, next) {
        req.filters = { _receiver: req.params.id, _game: req.params.game_id, sensor: req.params.sensor };
        base.listRoute(Tag)(req, res, next);
    });
router.route("/:id/games/:game_id/tags/incoming/:sensor/:id")
    // You were tagged at a sensor and want to upload it
    .put(function(req, res, next) {
        req.body._receiver = req.params.id;
        req.body.location = req.params.sensor;
        base.updateRoute(Tag)(req, res, next);
    });
module.exports = router;
