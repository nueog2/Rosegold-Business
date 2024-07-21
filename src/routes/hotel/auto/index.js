const router = require("express").Router();

const managementController = require("../../../controllers/auto");

router.post("/", managementController.createHotelAuto);

module.exports = router;
