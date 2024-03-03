const router = require("express").Router();
const departmentRouter = require("./department");
const workerRouter = require("./worker");
const managementController = require("../../controllers/management");
const requirement_categoryRouter = require("./requirement_category");
const chatbot_docsRouter = require("./chatbot_docs");

router.use("/department", departmentRouter);
router.use("/worker", workerRouter);
// requirementcategory router 추가
router.use("/requirement_category", requirement_categoryRouter);
router.use("/chatbot_docs", chatbot_docsRouter);

router.post("/", managementController.createHotel);
router.get("/many", managementController.getHotelMany);
router.get("/one", managementController.getHotelOne);
router.put("/", managementController.updateHotel);
router.delete("/", managementController.deleteHotel);

module.exports = router;
