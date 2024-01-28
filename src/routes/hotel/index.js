const router = require("express").Router()
const departmentRouter = require("./department")
const workerRouter = require("./worker")
const managementController = require("../../controllers/management")

router.use("/department", departmentRouter)
router.use("/worker", workerRouter)

router.post("/", managementController.createHotel)
router.get("/many", managementController.getHotelMany)
router.get("/one", managementController.getHotelOne)
router.put("/", managementController.updateHotel)
router.delete("/", managementController.deleteHotel)

module.exports = router