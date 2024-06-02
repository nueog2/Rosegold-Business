const router = require("express").Router();
const requirementController = require("../../../../controllers/requirement");
const upload = require("../../../../modules/multer");

router.post(
  "/",
  upload.single("file"),
  requirementController.createRequirement
);
router.get("/many", requirementController.getRequirementMany);
router.get("/one", requirementController.getRequirementOne);
router.get(
  "/many/requirement_category",
  requirementController.getRequirementManyByRequirementCategoryID
);
router.put("/", upload.single("file"), requirementController.updateRequirement);
router.delete("/", requirementController.deleteRequirement);

module.exports = router;
