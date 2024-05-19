const router = require("express").Router();
const departmentRouter = require("./department");
const workerRouter = require("./worker");
const managementController = require("../../controllers/management");
const requirement_categoryRouter = require("./requirement_category");
const chatbot_docsRouter = require("./chatbot_docs");
const chattingLogRouter = require("./chatting_log");
const roomRouter = require("./room");
const requirement_logRouter = require("./requirement_log");
const messageRouter = require("./message");
const auth_util = require("../../middlewares/auth_util");

router.use("/department", departmentRouter);
router.use("/worker", workerRouter);
// requirementcategory router 추가
router.use("/requirement_category", requirement_categoryRouter);
router.use("/chatbot_docs", auth_util.verifyToken, chatbot_docsRouter);
router.use("/chatting_log", chattingLogRouter);
router.use("/room", auth_util.verifyToken, roomRouter);
router.use("/requirement_log", requirement_logRouter);
router.use("/message", messageRouter);

router.post("/", managementController.createHotel);
router.get("/many", auth_util.verifyToken, managementController.getHotelMany);
router.get("/one", auth_util.verifyToken, managementController.getHotelOne);
router.put("/", managementController.updateHotel);
router.delete("/", auth_util.verifyToken, managementController.deleteHotel);

module.exports = router;
