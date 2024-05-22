const router = require("express").Router();
const managementController = require("../../../controllers/room_grade");

router.post("/", managementController.createRoomGrade);
router.get("/many", managementController.getRoomGradeMany);
router.get("/one", managementController.getRoomGradeOne);
router.put("/", managementController.updateRoomGrade);
router.delete("/", managementController.deleteRoomGrade);

module.exports = router;
