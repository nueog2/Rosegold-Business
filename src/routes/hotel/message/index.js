const router = require("express").Router();
const managementController = require("../../../controllers/management");
const authUtil = require("../../../middlewares/auth_util");

router.post("/send", authUtil.verifyToken, managementController.sendMessage);
router.get("/many", authUtil.verifyToken, managementController.readMessages);
router.post("/ok", authUtil.verifyToken, managementController.okMessage);

module.exports = router;
