var mongoose = require('mongoose');
var uuid = require("uuid");
var bcrypt = require("bcrypt-nodejs");
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var employeeSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    email: {type: String, unique: true},
    password: String,
    mfa: String,
    name: String/*,
    location: {type: String, ref: "Location"}*/
});

employeeSchema.pre('save', function(next) {
    var employee = this;

    // Only hash the password if it is new
    if (!employee.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password using our new salt
        bcrypt.hash(employee.password, salt, function(err, hash) {
            if (err) return next(err);

            // Override the plaintext password with the hashed one
            employee.password = hash;
            next();
        });
    });
});

employeeSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("Employee", employeeSchema);
