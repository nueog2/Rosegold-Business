const agoraChannelController = require("../../../controllers/agora_channel");
const router = require("express").Router();

router.post("/", agoraChannelController.createAgoraChannel);

module.exports = router;
