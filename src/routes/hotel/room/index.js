const router = require("express").Router();
const managementController = require("../../../controllers/management");

router.post("/", managementController.createRoom);
router.get("/many", managementController.getRoomMany);
router.get("/many/floor", managementController.getRoomManyByFloor);
router.get("/many/grade", managementController.getRoomManyByRoomGrade);
router.get("/many/checkin", managementController.getRoomManyByCheckin);
router.get("/floor", managementController.getRoomFloors);
router.get("/one", managementController.getRoomOne);
router.get("/one/name", managementController.getRoomOneByName);
router.put("/", managementController.updateRoom);
router.put("/grade", managementController.updateRoomGrade);
router.put("/price", managementController.updateRoomPrice);
router.put("/price/add", managementController.updateRoomPriceAdd);
router.put("/checkin", managementController.updateRoomCheckinStatusbyArray);
router.post("/checkout", managementController.checkoutRoom);
router.delete("/", managementController.deleteRoom);
router.delete("/hotel", managementController.deleteRoombyHotel);

module.exports = router;
