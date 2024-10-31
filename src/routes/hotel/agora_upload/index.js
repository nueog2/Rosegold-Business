const router = require("express").Router();
const multer = require("multer");
const agoraUploadController = require("../../../controllers/agora_upload");
const storage = multer.memoryStorage(); // 메모리에 파일 저장
const upload = multer({ storage: storage }).array("files"); // 'files'는 input 필드의 name 속성

// 라우터에서 사용
router.post("/", upload, agoraUploadController.uploadCustomerFilestoFbStorage);

module.exports = router;
