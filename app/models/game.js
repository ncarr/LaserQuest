var mongoose = require("mongoose");
var uuid = require("uuid");
var Schema = mongoose.Schema;
gameSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    players: [{type: String, ref: "User"}],
    start_time: {type: Date, default: Date.now},
    end_time: {type: Date, default: Date.now}
});
module.exports = mongoose.model("Game", gameSchema);
