const router = require("express").Router();
const noticeController = require("../../../controllers/moonlight_notice");

router.post("/", noticeController.createMoonlightNotice);
router.get("/many", noticeController.getMoonlightNoticeMany);
router.delete("/", noticeController.deleteMoonlightNotice);

module.exports = router;
