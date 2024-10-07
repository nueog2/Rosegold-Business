const router = require("express").Router();
const managementController = require("../../../controllers/service_category");
// const authUtil = require("../../../middlewares/auth_util");

router.post("/", managementController.createService_Category);
router.post("/array", managementController.createService_Category_Array);
router.get("/many", managementController.getService_CategoryMany);
router.get("/one", managementController.getService_CategoryOne);
router.delete("/", managementController.deleteService_Category);

module.exports = router;
