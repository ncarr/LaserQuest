'use strict';
const player = require('./player');
const game = require('./game');
const tag = require('./tag');
const location = require('./location');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(location);
  app.configure(tag);
  app.configure(game);
  app.configure(player);
};
