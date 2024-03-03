const router = require("express").Router();
const managementController = require("../../../controllers/management")

router.post("/", managementController.createRoom)
router.get("/many", managementController.getRoomMany)
router.get("/one", managementController.getRoomOne)
router.put("/", managementController.updateRoom)
router.delete("/", managementController.deleteRoom)

module.exports = router 