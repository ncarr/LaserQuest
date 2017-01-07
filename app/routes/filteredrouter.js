var express = require("express");
var Router = require("./router");
module.exports = function (model, router) { // Ensure all routes are filtered by location and locations are added to documents created with this router
    if (!router)
        var router = express.Router({mergeParams: true});
    router.use(function (req, res, next) {
        req.filters = {_location: req.params.location_id};
        next();
    });
    router.post("/", function (req, res, next) {
        req.body._location = req.params.location_id;
        next();
    });
    return Router(model, router);
};
