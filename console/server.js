var express = require("express");
var router = express.Router();
router.route("/")
    .get(function(req, res) {
        res.send("This will eventually be a sign-in page");
    });
module.exports = router;
