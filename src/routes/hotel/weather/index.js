const router = require("express").Router();
const managementController = require("../../../controllers/weather");
// const authUtil = require("../../../middlewares/auth_util");

router.get("/", managementController.getCurrentWeather);

module.exports = router;
