var express = require("express");
var Employee = require("../models/employee");
var Router = require("./router");
var router = express.Router({mergeParams: true});
// If the API is being called from within a location, scope it to the location
router.use(function (req, res, next) {
  if (req.params.location_id) {
    req.filters = { _location: req.params.location_id };
  }
  next();
});
router.post("/", function(req, res, next) {
  if (req.params.location_id) req.body._location = req.params.location_id;
  if (req.body) {
    if (req.body.location_id) {
      req.body._location = req.body.location_id;
      delete req.body.location_id;
    }
  }
  next();
});

// All actions for an individual employee
router.put("/:id", function (req, res, next) {
  if (req.body) {
    if (req.body.location_id) {
      req.body._location = req.body.location_id;
      delete req.body.location_id;
    }
  }
  next();
});

router = Router(Employee, router);
module.exports = router;
