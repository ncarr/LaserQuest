var location = require("../models/location");
var Router = require("./router");
var router = Router(location);
router.use("/:location_id/games", require("./games"));
router.use("/:location_id/users", require("./users"));
router.use("/:location_id/employees", require("./employees"));
module.exports = router;
