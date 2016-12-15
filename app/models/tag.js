var mongoose = require("mongoose");
var uuid = require("node-uuid");
var Schema = mongoose.Schema;
tagSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    _sender: {type: String, ref: "User"},
    _receiver: {type: String, ref: "User"},
    time: Number
});
module.exports = mongoose.model("Tag", tagSchema);