const router = require("express").Router();
const chattinglogetcController = require("../../../controllers/moonlight_chat_etc");

router.post("/", chattinglogetcController.createMoonlightChattingLog_Etc);
router.get("/many", chattinglogetcController.getMoonlightChattingLog_Etc);
router.delete("/", chattinglogetcController.deleteMoonlightChattingLog_Etc);
router.delete(
  "/hotel",
  chattinglogetcController.deleteMoonlightChattingLog_EtcbyhotelID
);

module.exports = router;
