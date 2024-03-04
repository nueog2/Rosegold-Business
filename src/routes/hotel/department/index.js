const router = require("express").Router();
const roleRouter = require("./role");

const managementController = require("../../../controllers/management");

router.use("/role", roleRouter);

router.post("/", managementController.createDepartment);
router.get("/many", managementController.getDepartmentMany);
router.get("/one", managementController.getDepartmentOne);
router.put("/", managementController.updateDepartment);
router.delete("/", managementController.deleteDepartment);

module.exports = router;
