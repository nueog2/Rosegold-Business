const router = require("express").Router();
const managementController = require("../../../controllers/floor");

router.post("/", managementController.createFloor);
router.get("/many", managementController.getFloorMany);
router.get("/one", managementController.getFloorOne);
//router.put("/", managementController.updateFloor);
router.delete("/", managementController.deleteFloor);

module.exports = router;
