const router = require("express").Router()
const managementController = require("../../../../controllers/management")

router.post("/", managementController.createRole)
router.get("/many", managementController.getRoleMany)
router.get("/one", managementController.getRoleOne)
router.get("/many/department", managementController.getRoleManyByDepartmentID)
router.put("/", managementController.updateRole)
router.delete("/", managementController.deleteRole)

module.exports = router