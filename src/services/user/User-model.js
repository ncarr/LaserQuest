'use strict';

// User-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  location: {type: String, ref: "Location"},
  email: {type: String, unique: true},
  password: {type: String},
  name: String
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
