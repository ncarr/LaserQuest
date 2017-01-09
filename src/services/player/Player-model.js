'use strict';

// Player-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  location: {type: String, ref: "Location"},
  games: [{type: String, ref: "Game"}],
  name: String
});

PlayerSchema.pre("remove", function (next) {
  Game.update({_location: this._location, players: this._id}, {$pull: {players: this._id}}, function (err, n) {
    if (err) return next(err);

    next();
  });
});

PlayerSchema.statics.addGame = function (playerFilters, gameFilters, cb) {
  this.findOne(playerFilters, function (err, player) {
      Game.findOne(gameFilters, function(err, game) {
          if (err) return cb(err);

          game.players.push(player._id);  // Add the player to the game
          player.games.push(game._id); // Add the game to the player

          // Save the player
          game.save(function(err) {
              if (err) return cb(err);

              // save the player and check for errors
              player.save(function(err) {
                  if (err) return cb(err);
                  cb(null, player);
              });
          });
      });
  });
}

PlayerSchema.statics.removeGame = function (playerFilters, gameFilters, cb) {
  this.update({ _id: req.params.id, _location: req.params.location_id }, {$pull: {games: req.params.game_id}}, function (err) {
    if (err) return cb(err);

    Game.update({ _id: req.params.id, _location: req.params.location_id }, {$pull: {players: req.params.id}}, function (err) {
      if (err) return cb(err);

      cb(null);
    });
  });
}

const PlayerModel = mongoose.model('Player', PlayerSchema);

module.exports = PlayerModel;
