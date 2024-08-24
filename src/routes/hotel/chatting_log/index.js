const chattingLogController = require("../../../controllers/chatting_log");
const router = require("express").Router();
const chattingLogDBController = require("../../../controllers/chatting_log_db");

router.post("/", chattingLogController.createChattingLog);
router.get("/many", chattingLogController.getChattingLog);
router.get("/one", chattingLogController.getChattingLogbyidentifier);
router.get("/db", chattingLogDBController.getChattingLogfromDB);
router.get("/db/hotel", chattingLogDBController.getChattingLogfromDBbyHotel);
router.get("/many/all", chattingLogController.getChattingLogAll);
router.get("/count", chattingLogController.getChattingLogDoubleCountHandler);

module.exports = router;
