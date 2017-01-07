var mongoose = require("mongoose"); // Database module
var exports;

exports.createRoute = function (model) {
  return function(req, res, next) { // This is Express middleware for creating a new instance in the API
    model.create(req.body, function(err, instance) { // Create an instance of whichever model we are using
      if (err) return next(err); // If there is an error, stop and hand it to our error handler
      res.status(201).json(Object.assign({ message: model.modelName + ' created'}, instance.toJSON())); // Send back an HTTP 201 code, signifying everything is OK and we created something, send a success message and send a copy of the object
    });
  }
}

exports.listRoute = function (model) {
  return function(req, res, next) { // Express middleware for when we list current instances of the model
    model.find(req.filters || {}, function(err, instances) {
      if (err) return next(err);

      res.json(instances.toJSON());
    });
  }
}

exports.readRoute = function (model) {
  return function(req, res, next) { // Express middleware for when we get data on one instance of the model
    model.findOne(Object.assign(req.filters || {}, { _id: req.params.id }), function(err, instance) {
      if (err) return next(err);

      res.json(instance.toJSON());
    });
  }
}

exports.updateRoute = function (model) {
  return function(req, res, next) { // Express middleware for when we update an instance of the model
    model.findOne(Object.assign(req.filters || {}, { _id: req.params.id }), function(err, instance) {
      if (err) return next(err);

      for (var field in req.body) {
        if (req.body.hasOwnProperty(field)) {
          instance[field] = req.body[field];
        }
      }
      instance.save(function (err) {
        if (err) return next(err);

        res.json(Object.assign({ message: model.modelName + ' updated'}, instance.toJSON()));
      });
    });
  }
}

exports.deleteRoute = function (model) {
  return function(req, res, next) { // Express middleware for when we delete an instance of the model - rarely used as they often have other deletion requirements
    model.findOne(Object.assign(req.filters || {}, { _id: req.params.id }), function (err, instance) {
      if (err) return next(err);

      instance.remove(function (err, doc) {
        if (err) return next(err);

        res.json({ message: model.modelName + ' deleted'});
      });
    });
  }
}

module.exports = exports;
