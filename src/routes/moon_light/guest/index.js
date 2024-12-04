const router = require("express").Router();
const guestController = require("../../../controllers/moonlight_guest");

router.get("/many", guestController.getMoonlightGuestMany);
router.get("/", guestController.getMoonlightGuestOne);
router.put("/", guestController.updateMoonlightGuestProcess);
router.delete("/", guestController.deleteMoonlightGuest);
router.delete("/hotel", guestController.deleteMoonlightGuestbyHotelID);

module.exports = router;
