var mongoose = require('mongoose');
var uuid = require("uuid");
var bcrypt = require("bcrypt-nodejs");
var mfa = require("node-2fa");
var mongooseHidden = require("mongoose-hidden")({ defaultHidden: { password: true, mfa: true } });
var Schema = mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var employeeSchema = new Schema({
    _id: {type: String, default: uuid.v4},
    _location: {type: String, ref: "Location"},
    email: {type: String, unique: true},
    password: {type: String},
    mfa: {type: String},
    name: String
});

employeeSchema.pre('save', function(next) {
    var employee = this;

    // Only hash the password if it is new
    if (!employee.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password using our new salt
        bcrypt.hash(employee.password, salt, null, function(err, hash) {
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

employeeSchema.methods.verifyToken = function(token, cb) {
    if (err) return cb(err);
    isMatch = mfa.verifyToken(this.mfa, token);
    cb(null, isMatch);
};

employeeSchema.methods.setMfa = function(secret, cb) {
    if (err) return cb(err);
    this.mfa = secret;
    cb(null);
};

employeeSchema.methods.checkMfa = function(cb) {
    if (err) return cb(err);
    if (this.mfa) {
      cb(null, true);
    } else if (this.mfa === false) {
      cb(null, false);
    } else {
      cb(null, null);
    }
};

employeeSchema.plugin(mongooseHidden);
module.exports = mongoose.model("Employee", employeeSchema);
