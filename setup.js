require("dotenv").config();
var prompt = require("prompt");
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL);
var Employee = require("./app/models/employee");
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
    var employee = new Employee({ name: result.name, email: result.email, password: result.password });
    employee.save(function (err) {
      if (err)
          console.log(err);

      console.log("First user created successfully, run npm start and sign in at /console");
      mongoose.disconnect();
    });
});
