const chattingLogController = require("../../../controllers/chatting_log")
const router = require("express").Router()

router.post("/", chattingLogController.createChattingLog)
router.get("/", chattingLogController.getChattingLog)

module.exports = router