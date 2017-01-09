'use strict';

const User = require('./User-model');
const service = require('feathers-mongoose');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/users', service({
    Model: User
  }));

  // Get our initialize service to that we can bind hooks
  const userService = app.service('/users');

  // Set up our before hooks
  userService.before(hooks.before);

  // Set up our after hooks
  userService.after(hooks.after);
};
