const router = require("express").Router();
const managementController = require("../../../controllers/service");
// const authUtil = require("../../../middlewares/auth_util");

router.post("/", managementController.createService);
router.get("/many", managementController.getServiceMany);
router.get("/one", managementController.getServiceOne);
router.put("/", managementController.updateService);
router.delete("/", managementController.deleteService);

module.exports = router;
