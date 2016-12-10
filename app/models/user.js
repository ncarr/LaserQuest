var mongoose = require("mongoose");
var Schema = mongoose.Schema;
userSchema = new Schema({
    name: String
});
module.exports = mongoose.model("User", userSchema);
