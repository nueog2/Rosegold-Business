const router = require("express").Router();
const storageRouter = require("./moonlight_storage");
const moonlight_noticeRouter = require("./moonlight_notice");

router.use("/notice", moonlight_noticeRouter);
router.use("/storage", storageRouter);

module.exports = router;
