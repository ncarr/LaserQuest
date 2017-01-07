var mongoose = require("mongoose");
var uuid = require("uuid");
var Game = require("./game");
var Schema = mongoose.Schema;
userSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    _location: {type: String, ref: "Location"},
    games: [{type: String, ref: "Game"}],
    name: String
});

userSchema.pre("remove", function (next) {
  Game.update({_location: this._location, players: this._id}, {$pull: {players: this._id}}, function (err, n) {
    if (err) return next(err);

    next();
  });
});

userSchema.statics.addGame = function (userFilters, gameFilters, cb) {
  this.findOne(userFilters, function (err, user) {
      Game.findOne(gameFilters, function(err, game) {
          if (err) return cb(err);

          game.players.push(user._id);  // Add the user to the game
          user.games.push(game._id); // Add the game to the user

          // Save the user
          game.save(function(err) {
              if (err) return cb(err);

              // save the user and check for errors
              user.save(function(err) {
                  if (err) return cb(err);
                  cb(null, user);
              });
          });
      });
  });
}

userSchema.statics.removeGame = function (userFilters, gameFilters, cb) {
  this.update({ _id: req.params.id, _location: req.params.location_id }, {$pull: {games: req.params.game_id}}, function (err) {
    if (err) return cb(err);

    Game.update({ _id: req.params.id, _location: req.params.location_id }, {$pull: {players: req.params.id}}, function (err) {
      if (err) return cb(err);

      cb(null);
    });
  });
}

module.exports = mongoose.model("User", userSchema);
