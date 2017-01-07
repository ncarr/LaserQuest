var mongoose = require("mongoose");
var uuid = require("uuid");
var Schema = mongoose.Schema;
tagSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    _sender: {type: String, ref: "User"},
    _receiver: {type: String, ref: "User"},
    _game: {type: String, ref: "Game"},
    sensor: String,
    time: {type: Date, default: Date.now}
});
module.exports = mongoose.model("Tag", tagSchema);
