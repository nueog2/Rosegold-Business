const router = require("express").Router();
const storageRouter = require("./moonlight_storage");
const moonlight_noticeRouter = require("./moonlight_notice");
const moon_chatting_logRouter = require("./chatting_log");

router.use("/notice", moonlight_noticeRouter);
router.use("/storage", storageRouter);
router.use("/chatting_log", moon_chatting_logRouter);

module.exports = router;
