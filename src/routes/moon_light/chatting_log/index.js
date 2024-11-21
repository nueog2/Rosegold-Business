const router = require("express").Router();
const chattinglogController = require("../../../controllers/moonlight_chat_log");

router.post("/", chattinglogController.createMoonlightChattingLog);
router.get("/many", chattinglogController.getMoonlightChattingLog);
router.delete("/", chattinglogController.deleteMoonlightChattingLog);
router.delete(
  "/hotel",
  chattinglogController.deleteMoonlightChattingLogbyhotelID
);

module.exports = router;
