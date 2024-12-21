require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const router = require("./src/routes");
const db = require("./models");
const message = require("./config/message");
const googleStorage = require("@google-cloud/storage");
var serviceAccount = require("./config/firebase-key.json");

//const fileUpload = require("express-fileupload");

var admin = require("firebase-admin");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://rosegold-app.appspot.com/customer",
// });

var bucket = admin.storage().bucket();

// bucket.upload("/Users/megoe/Pictures/Screenshots/food1.png");

const cookieParser = require("cookie-parser");
const multer = require("./src/modules/multer");
const multer2 = require("./src/modules/multer2");
const tiktoken = require("./src/modules/tiktoken");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

app.use(cookieParser());

var port = process.env.PORT || 6060;
// 개발용으로 임시로 8080으로 배포
//실제 프로덕트용 port는 임시로 6060 으로 설정
//원래는 4040임.

// CORS 설정
app.use(
  cors({
    origin: "*", // 프론트엔드 주소 (특정 도메인만 허용) -> 일단 임시로 모든 도메인 허용
    credentials: true, // 쿠키 등 인증 정보 전달 허용
  })
);

db.sequelizeSync();

app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: false }));
app.set("view engine", "ejs");

app.use("/public", express.static(__dirname + "/public"));

//정적 파일 제공
app.use("/chatbot_docs", express.static(path.join(__dirname, "chatbot_docs")));
app.use("/req_thumb", express.static(path.join(__dirname, "req_thumb")));

//라우터 설정
app.use("/api", router);

//바디파서
app.use(bodyParser.json());

app.all("*", function (req, res) {
  return res
    .status(message["404_NOT_FOUND"].status)
    .send(message["404_NOT_FOUND"]);
});

//포트 설정 및 서버 실행
app.listen(port, function () {
  console.log(`Server is listening at localhost:${port}`);
});
