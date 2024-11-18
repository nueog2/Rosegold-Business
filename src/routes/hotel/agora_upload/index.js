const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
// const upload = multer({ storage });
const agoraUploadController = require("../../../controllers/agora_upload.js");
// const storage = multer.memoryStorage();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload",
  upload.array("files"),
  agoraUploadController.uploadCustomerFilestoFbStorage
);

router.post(
  "/guest",
  upload.array("files"),
  agoraUploadController.uploadCustomerFilestoFbStoragewithGuest
);

// // 라우터에서 사용
// router.post("/test", agoraUploadController.addToFirestore);
// router.post("/", upload, agoraUploadController.uploadCustomerFilestoFbStorage);

module.exports = router;
