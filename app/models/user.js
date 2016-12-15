var mongoose = require("mongoose");
var uuid = require("uuid");
var Schema = mongoose.Schema;
userSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    games: [{type: String, ref: "Game"}],
    name: String
});
module.exports = mongoose.model("User", userSchema);
