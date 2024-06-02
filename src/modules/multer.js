const multer = require("multer");
const path = require("path");
const fs = require("fs");

// 파일 저장용 디렉토리 생성
const uploadDir = path.join(__dirname, "../../req_thumb/");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "req_thumb/");
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}${ext}`); // 짧은 파일 이름 사용
    // cb(null, Date.now() + path.extname(file.originalname)); // e.g. 1234567890.jpg
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
