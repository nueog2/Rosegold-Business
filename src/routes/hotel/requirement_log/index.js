const router = require("express").Router();
const requirement_logController = require("../../../controllers/requirement_log");

router.post("/", requirement_logController.createRequirementLog);
router.post("/menu", requirement_logController.createRequirementLogbyMenu);
router.post(
  "/service",
  requirement_logController.createRequirementLogAdditionalService
);
router.get("/many", requirement_logController.getRequirementLogMany);
router.get("/many/date", requirement_logController.getRequirementLogManyByDate);
router.get("/many/room", requirement_logController.getRequirementLogManyByRoom);
router.get(
  "/many/detail",
  requirement_logController.getRequirementLogManyDetail
);

router.get(
  "/many/summary",
  requirement_logController.getSummarizedSentencesForHotel
);

router.get("/one", requirement_logController.getRequirementLogOne);
router.put("/", requirement_logController.updateRequirementLog);
router.put(
  "/department",
  requirement_logController.updateRequirementLogDepartment
);
router.put("/worker", requirement_logController.updateRequirementLogWorker);
router.put("/read", requirement_logController.updateRequirementLogRead);
router.delete("/", requirement_logController.deleteRequirementLog);
router.delete("/hotel", requirement_logController.deleteRequirementLogByHotel);

router.get(
  "/statistics",
  requirement_logController.getRequirementLogStatisticsHandler
);

router.get(
  "/statistics/total",
  requirement_logController.getRequirementLogStatisticsTotalHandler
);

router.get(
  "/readcount",
  requirement_logController.getRequirementLogStatisticsforReadCount
);

module.exports = router;
