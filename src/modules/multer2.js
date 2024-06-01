const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 파일 저장용 디렉토리 생성
const uploadDir = path.join(__dirname, "../../chatbot_docs/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "chatbot_docs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1234567890.jpg
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
