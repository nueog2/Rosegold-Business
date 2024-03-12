const router = require("express").Router();
const requirement_logController = require("../../../controllers/requirement_log");

router.post("/", requirement_logController.createRequirementLog);
router.get("/many", requirement_logController.getRequirementLogMany);
router.get("/one", requirement_logController.getRequirementLogOne);
router.put("/", requirement_logController.updateRequirementLog);
router.put(
  "/department",
  requirement_logController.updateRequirementLogDepartment
);
router.put("/worker", requirement_logController.updateRequirementLogWorker);
router.delete("/", requirement_logController.deleteRequirementLog);

module.exports = router;
