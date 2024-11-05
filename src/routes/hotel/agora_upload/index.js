const router = require("express").Router();
const multer = require("multer");
const storage = multer.memoryStorage();
// const upload = multer({ storage }); // dest 속성 제거 - 메모리 저장소 사용
const agoraUploadController = require("../../../controllers/agora_upload.js");
// const storage = multer.memoryStorage(); // 메모리에 파일 저장
const upload = multer({ storage: storage }).array("files"); // 'files'는 input 필드의 name 속성

// // 라우터에서 사용
// router.post("/test", agoraUploadController.addToFirestore);
// router.post("/", upload, agoraUploadController.uploadCustomerFilestoFbStorage);

module.exports = router;
