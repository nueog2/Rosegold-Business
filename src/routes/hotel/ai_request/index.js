const router = require("express").Router();

const managementController = require("../../../controllers/ai_request");

router.post("/", managementController.addAiRequest);
router.get("/", managementController.getAiRequestAutoCountHandler);

module.exports = router;
