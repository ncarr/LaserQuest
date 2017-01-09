'use strict';

// Game-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  location: {type: String, ref: "Location"},
  players: [{type: String, ref: "Player"}],
  start_time: {type: Date, default: Date.now},
  end_time: Date
});

GameSchema.pre('remove', function(next) {
    var Player = this.model("Player");
    var Tag = this.model("Tag");
    Tag.remove({ _game: this._id }, function(err, tags) {
        if (err) return next(err);
        Player.remove({$and: [{games: [this._id]}, {games: {$size: 1}}]}, function (err, n) {
            if (err) return next(err);
            Player.update({_id: { $in: this.players }}, {$pullAll: {games: [this._id]}}, function (err, n) {
                if (err) return next(err);

                next();
            });
        });
    });
});
GameSchema.statics.createPlayer = function (gameFilters, playerProperties, cb) {
    this.findOne(gameFilters, function(err, game) {
        if (err) return cb(err);

        var player = new this.model('Player')(playerProperties);  // create a new player, set their properties
        player._location = game._location;
        player.games = [game._id];
        game.players.push(player._id);  // Add the player to the game

        // Save the game
        game.save(function(err) {
            if (err) return cb(err);

            // save the player and check for errors
            player.save(function (err) {
              if (err) return cb(err);
              cb(null, player);
            });
        });
    });
}

const GameModel = mongoose.model('Game', GameSchema);

module.exports = GameModel;
