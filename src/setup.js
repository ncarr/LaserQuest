'use strict';

const path = require('path');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');

const app = feathers();
app.configure(configuration(path.join(__dirname, '..')));

const mongoose = require('mongoose');
// Tell mongoose to use native promises
// See http://mongoosejs.com/docs/promises.html
mongoose.Promise = global.Promise;
// Connect to your MongoDB instance(s)
mongoose.connect(app.get('mongodb'));

const services = require('./services');
app.configure(hooks())
  .configure(services);

const prompt = require('prompt');
var schema = {
    properties: {
      name: {
        required: true
      },
      email: {
        required: true
      },
      password: {
        hidden: true,
        required: true
      }
    }
  };
prompt.start();
prompt.get(schema, function (err, result) {
    app.service('/users').create({ name: result.name, email: result.email, password: result.password }, function (err) {
      if (err)
          console.log(err);

      console.log("First user created successfully, run npm start and send a POST request to `/auth/local` with properly filled out email and password fields in the request body to get a token");
      mongoose.disconnect();
    });
});
