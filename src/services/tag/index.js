'use strict';

const Tag = require('./Tag-model');
const service = require('feathers-mongoose');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  // Initialize our service with any options it requires
  app.use('/tags', service({
    Model: Tag
  }));

  // Get our initialize service to that we can bind hooks
  const tagService = app.service('/tags');

  // Set up our before hooks
  tagService.before(hooks.before);

  // Set up our after hooks
  tagService.after(hooks.after);
};
