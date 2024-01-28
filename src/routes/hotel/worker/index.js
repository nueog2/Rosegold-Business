const router = require("express").Router()
const managementController = require("../../../controllers/management")

router.post("/", managementController.createWorker)
router.get("/many", managementController.getWorkerMany)
router.get("/many/department", managementController.getWorkerManyByDepartment)
router.get("/one", managementController.getWorkerOne)
router.put("/", managementController.updateWorker)
router.delete("/", managementController.deleteWorker)

module.exports = router