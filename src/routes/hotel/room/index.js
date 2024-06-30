const router = require("express").Router();
const managementController = require("../../../controllers/management");

router.post("/", managementController.createRoom);
router.get("/many", managementController.getRoomMany);
router.get("/many/floor", managementController.getRoomManyByFloor);
router.get("/floor", managementController.getRoomFloors);
router.get("/one", managementController.getRoomOne);
router.put("/", managementController.updateRoom);
router.put("/grade", managementController.updateRoomGrade);
router.put("/price", managementController.updateRoomPrice);
router.put("/price/add", managementController.updateRoomPriceAdd);
router.post("/checkout", managementController.checkoutRoom);
router.delete("/", managementController.deleteRoom);

module.exports = router;
