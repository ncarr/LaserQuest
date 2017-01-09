'use strict';

// Tag-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const TagSchema = new Schema({
  _id: {type: String, default: uuid.v4},
  sender: {type: String, ref: "Player"},
  receiver: {type: String, ref: "Player"},
  game: {type: String, ref: "Game"},
  sensor: String,
  time: {type: Date, default: Date.now}
});

const TagModel = mongoose.model('Tag', TagSchema);

module.exports = TagModel;
