const router = require("express").Router();
const chatbot_docsController = require("../../../controllers/chatbot_docs");
const multer2 = require("../../../modules/multer2");

router.post(
  "/",
  multer2.single("file"),
  chatbot_docsController.createChatbot_Docs
);
router.get("/many", chatbot_docsController.getChatbot_DocsMany);
router.get("/one", chatbot_docsController.getChatbot_DocsOne);
router.put("/", chatbot_docsController.updateChatbot_Docs);
router.delete("/", chatbot_docsController.deleteChatbot_Docs);

module.exports = router;
