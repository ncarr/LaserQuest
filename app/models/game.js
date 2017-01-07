var mongoose = require("mongoose");
var uuid = require("uuid");
var Schema = mongoose.Schema;
var User = require("./user");
var Tag = require("./tag");
var gameSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    _location: {type: String, ref: "Location"},
    players: [{type: String, ref: "User"}],
    start_time: {type: Date, default: Date.now},
    end_time: Date
});
gameSchema.pre('remove', function(next) {
    Tag.remove({ _game: this._id }, function(err, tags) {
        if (err) return next(err);
        User.remove({$and: [{games: [this._id]}, {games: {$size: 1}}]}, function (err, n) {
            if (err) return next(err);
            User.update({_id: { $in: this.players }}, {$pullAll: {games: [this._id]}}, function (err, n) {
                if (err) return next(err);

                next();
            });
        });
    });
});
gameSchema.statics.createUser = function (gameFilters, userProperties, cb) {
    this.findOne(gameFilters, function(err, game) {
        if (err) return cb(err);

        var user = new User(userProperties);  // create a new user, set their properties
        user._location = game._location;
        user.games = [game._id];
        game.players.push(user._id);  // Add the user to the game

        // Save the game
        game.save(function(err) {
            if (err) return cb(err);

            // save the user and check for errors
            user.save(function (err) {
              if (err) return cb(err);
              cb(null, user);
            });
        });
    });
}
module.exports = mongoose.model("Game", gameSchema);
