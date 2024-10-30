const agoraChannelController = require("../../../controllers/agora_channel");
const router = require("express").Router();

router.post("/", agoraChannelController.createAgoraChannel);
router.get("/many", agoraChannelController.readManyChannel);
router.get("/one", agoraChannelController.readOneChannel);
router.put("/", agoraChannelController.updateChannelName);
router.put("/process", agoraChannelController.updateChannelProcess);

module.exports = router;
