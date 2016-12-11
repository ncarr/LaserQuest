var mongoose = require("mongoose");
var uuid = require("node-uuid");
var Schema = mongoose.Schema;
gameSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    players: [{type: String, ref: "User"}],
    start_time: Number,
    end_time: Number
});
module.exports = mongoose.model("Game", gameSchema);
