const router = require("express").Router();
const departmentRouter = require("./department");
const workerRouter = require("./worker");
const managementController = require("../../controllers/management");

const autoRouter = require("./auto");
const requirement_categoryRouter = require("./requirement_category");
const chatbot_docsRouter = require("./chatbot_docs");
const chattingLogRouter = require("./chatting_log");
const roomRouter = require("./room");
const requirement_logRouter = require("./requirement_log");
const messageRouter = require("./message");
const auth_util = require("../../middlewares/auth_util");
const room_gradeRouter = require("./room_grade");
const floorRouter = require("./floor");
const serviceRouter = require("./services");
const service_categoryRouter = require("./service_category");
const work_noticeRouter = require("./work_notice");
const weatherRouter = require("./weather");

router.use("/department", departmentRouter);
router.use("/worker", workerRouter);
// requirementcategory router 추가
router.use("/requirement_category", requirement_categoryRouter);
router.use("/chatbot_docs", auth_util.verifyToken, chatbot_docsRouter);
router.use("/chatting_log", chattingLogRouter);
router.use("/room", roomRouter);
router.use("/requirement_log", requirement_logRouter);
router.use("/work_notice", work_noticeRouter);

router.use("/room_grade", room_gradeRouter);

router.use("/floor", floorRouter);
router.use("/message", messageRouter);
router.use("/service", serviceRouter);
router.use("/service_category", service_categoryRouter);
router.use("/auto", autoRouter);

router.use("/weather", weatherRouter);

router.post("/", managementController.createHotel);
router.get("/many", auth_util.verifyToken, managementController.getHotelMany);
router.get("/one", auth_util.verifyToken, managementController.getHotelOne);
router.put("/", managementController.updateHotel);
router.delete("/", auth_util.verifyToken, managementController.deleteHotel);
// router.post("/auto", managementController2.createHotelAuto);

module.exports = router;
