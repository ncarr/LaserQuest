'use strict';

const Game = require('./Game-model');
const service = require('feathers-mongoose');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/games', service({
    Model: Game
  }));

  // Get our initialize service to that we can bind hooks
  const gameService = app.service('/games');

  // Set up our before hooks
  gameService.before(hooks.before);

  // Set up our after hooks
  gameService.after(hooks.after);
};
