const router = require("express").Router();
const managementController = require("../../../controllers/service");
// const authUtil = require("../../../middlewares/auth_util");

router.post("/", managementController.createService);
router.post("/array", managementController.createServicebyArray);
router.get("/many", managementController.getServiceMany);
router.get("/one", managementController.getServiceOne);
router.put("/", managementController.updateService);
router.delete("/", managementController.deleteService);

router.post("/assign", managementController.createServiceAssignLog);
router.get(
  "/assign/many/department",
  managementController.getServiceAssignLogByDepartmentID
);
router.delete("/assign", managementController.deleteServiceAssignLog);
module.exports = router;
