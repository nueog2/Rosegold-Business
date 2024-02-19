const router = require("express").Router();
const requirementRouter = require("./requirement");
const requirement_categoryController = require("../../../controllers/requirement_category");

router.use("/requirement", requirementRouter);

router.post("/", requirement_categoryController.createRequirement_Category);
router.get("/many", requirement_categoryController.getRequirement_CategoryMany);
router.get("/one", requirement_categoryController.getRequirement_CategoryOne);
router.put("/", requirement_categoryController.updateRequirement_Category);
router.delete("/", requirement_categoryController.deleteRequirement_Category);

module.exports = router;
