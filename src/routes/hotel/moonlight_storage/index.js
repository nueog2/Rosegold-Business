const router = require("express").Router();
const storageController = require("../../../controllers/moonlight_storage");

router.post("/", storageController.createStorage);
router.get("/many", storageController.readManyStorage);
router.get("/many/name", storageController.readOneStorageByRoomName);
router.get("/", storageController.readOneStorage);
router.put("/", storageController.updateStorage);
router.put("/clear", storageController.clearStorageByID);
router.delete("/", storageController.deleteStorageByID);

module.exports = router;
