const router = require("express").Router();
const requirementController = require("../../../../controllers/requirement");

router.post("/", requirementController.createRequirement);
router.get("/many", requirementController.getRequirementMany);
router.get("/one", requirementController.getRequirementOne);
router.get(
  "/many/requirement_category",
  requirementController.getRequirementManyByRequirementCategoryID
);
router.put("/", requirementController.updateRequirement);
router.delete("/", requirementController.deleteRequirement);

module.exports = router;
