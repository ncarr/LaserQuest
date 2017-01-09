'use strict';

// Location-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const LocationSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  address: String
});

// Remove all dependent Players, Games and Tags when removing a Location
LocationSchema.pre('remove', function(next) {
    var Game = this.model("Game");
    var Player = this.model("Player");
    var Tag = this.model("Tag");

    Game.find({location: req.params.location_id}, function (err, games) {
      Tag.remove({ game: { $in: games._id }}, function (err) {
        if (err) return next();

        Game.remove({location: this._id}, function (err) {
          if (err) return next(err);

          Player.remove({location: this._id}, function (err) {
            if (err) return next(err);

            next();
          });
        });
      });
    });
});

const LocationModel = mongoose.model('Location', LocationSchema);

module.exports = LocationModel;
