'use strict';

const LocationModel = require('./Location-model');
const service = require('feathers-mongoose');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/locations', service({
    Model: LocationModel
  }));

  // Get our initialize service to that we can bind hooks
  const locationService = app.service('/locations');

  // Set up our before hooks
  locationService.before(hooks.before);

  // Set up our after hooks
  locationService.after(hooks.after);
};
