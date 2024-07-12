const router = require("express").Router();
const managementController = require("../../../controllers/work_notice");

router.post("/", managementController.createWorkNotice);
router.get("/many", managementController.getWorkNoticeMany);
router.delete("/", managementController.deleteWorkNotice);

module.exports = router;
