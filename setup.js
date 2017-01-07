require("dotenv").config();
var prompt = require("prompt");
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;
var Employee = require("./app/models/employee");
var Location = require("./app/models/location");
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
      },
      workAddress: {
        required: true
      }
    }
  };
prompt.start();
prompt.get(schema, function (err, result) {
    var location = new Location({ address: result.workAddress });
    location.save(function (err) {
      if (err)
        console.log(err);

        var employee = new Employee({ _location: location._id, name: result.name, email: result.email, password: result.password });
        employee.save(function (err) {
          if (err)
              console.log(err);

          console.log("First user created successfully, run npm start and sign in at /console");
          mongoose.disconnect();
        });
    });
});
