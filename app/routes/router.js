var express = require("express");
var base = require("./base");
function Router(model, router) {
    if (!router)
        var router = express.Router({mergeParams: true});
    router.route('/')
        // This runs when you send a post request to create a new document
        .post(base.createRoute(model))
        // List all instances
        .get(base.listRoute(model));

    // All actions for an individual document
    router.route('/:id')
        // Get the document
        .get(base.readRoute(model))
        // Edit the document
        .put(base.updateRoute(model))
        // Delete the document with this id
        .delete(base.deleteRoute(model));
    return router;
};
module.exports = Router;
