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
const ai_requestRouter = require("./ai_request");
const chattingLogGuestRouter = require("./chatting_log_guest");
const ex_questionRouter = require("./ex_question");
const chattingLogFrontRouter = require("./chatting_log_front");
const agoraChattingRouter = require("./agora_channel");
const agoraUploadRouter = require("./agora_upload");

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
router.use("/ai_request", ai_requestRouter);
router.use("/chatting_log_guest", chattingLogGuestRouter);
router.use("/ex_question", ex_questionRouter);
router.use("/potential", chattingLogFrontRouter);
router.use("/agora_channel", agoraChattingRouter);
router.use("/agora_upload", agoraUploadRouter);

router.use("/weather", weatherRouter);

router.post("/", managementController.createHotel);
router.get("/many", managementController.getHotelMany);
router.get("/one", managementController.getHotelOne);
router.put("/", managementController.updateHotel);
router.delete("/", auth_util.verifyToken, managementController.deleteHotel);
// router.post("/auto", managementController2.createHotelAuto);

module.exports = router;
