var mongoose = require("mongoose");
var uuid = require("uuid");
var Schema = mongoose.Schema;
var locationSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    address: String
});
locationSchema.pre('remove', function(next) {
    var Game = this.model("Game");
    var User = this.model("User");
    var Tag = this.model("Tag");

    Game.find({_location: req.params.location_id}, function (err, games) {
      Tag.remove({ _game: { $in: games._id }}, function (err) {
        if (err) return next();

        Game.remove({_location: this._id}, function (err) {
          if (err) return next(err);

          User.remove({_location: this._id}, function (err) {
            if (err) return next(err);

            next();
          });
        });
      });
    });
});
module.exports = mongoose.model("Location", locationSchema);
