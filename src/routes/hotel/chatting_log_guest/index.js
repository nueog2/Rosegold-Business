const chattingLogGuestController = require("../../../controllers/chatting_log_guest");
const router = require("express").Router();

router.post("/token", chattingLogGuestController.createTokensforGuest);

router.post("/naver", chattingLogGuestController.createChattingLogGuest_Naver);
// router.get("/naver", chattingLogGuestController.getChattingLogGuest_Naver);
router.post(
  "/naver/send",
  chattingLogGuestController.sendChattingLogGuest_Naver
);
router.post("/kakao", chattingLogGuestController.createChattingLogGuest_Kakao);
router.post("/kakao", chattingLogGuestController.sendChattingLogGuest_Kakao);

router.post("/page", chattingLogGuestController.createChattingLogGuest_Page);

router.get("/many", chattingLogGuestController.getChattingLogGuest_Many);

module.exports = router;
