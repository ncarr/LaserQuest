'use strict';

const Player = require('./Player-model');
const service = require('feathers-mongoose');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/players', service({
    Model: Player
  }));

  // Get our initialize service to that we can bind hooks
  const playerService = app.service('/players');

  // Set up our before hooks
  playerService.before(hooks.before);

  // Set up our after hooks
  playerService.after(hooks.after);
};
