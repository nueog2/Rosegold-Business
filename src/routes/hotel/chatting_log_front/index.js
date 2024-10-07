const chattingLogFrontController = require("../../../controllers/chatting_log_front");
const router = require("express").Router();

router.post("/", chattingLogFrontController.createChattingLogFront);
router.post("/send", chattingLogFrontController.sendChattingLogFront);
router.get("/many", chattingLogFrontController.getChattingLogFront);

module.exports = router;
