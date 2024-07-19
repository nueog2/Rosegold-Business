require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const router = require("./src/routes");
const db = require("./models");
const message = require("./config/message");
//const fileUpload = require("express-fileupload");

const cookieParser = require("cookie-parser");
const multer = require("./src/modules/multer");
const multer2 = require("./src/modules/multer2");
const tiktoken = require("./src/modules/tiktoken");
const bodyParser = require("body-parser");

app.use(cookieParser());

// app.use(
//   fileUpload({
//     createParentPath: true,
//   })
// );

//app.use("/upload", express.static("upload"));

// app.post("/upload", async (req, res) => {
//   try {
//     if (!req.files || !req.files.file) {
//       console.log("400_BAD_REQUEST: 파일 업로드 실패: 파일이 없습니다.");
//       return res.status(400).send({
//         status: false,
//         message: "파일 업로드 실패: 파일이 없습니다.",
//       });
//     }

//     let f = req.files.file;

//     if (f.mimetype !== "text/plain") {
//       console.log("400_BAD_REQUEST: 허용되지 않는 파일 형식");
//       return res.status(400).send({
//         status: false,
//         message: "허용되지 않는 파일 형식입니다. txt 파일만 업로드 가능합니다.",
//       });
//     }

//     f.mv("./upload/" + f.name, function (err) {
//       if (err) {
//         console.log("500_SERVER_INTERNAL_ERROR", err);
//         return res.status(500).send({
//           status: false,
//           message: "파일 저장 중 에러가 발생했습니다.",
//           error: err,
//         });
//       }
//       console.log("200_SUCCESS");
//       res.send({
//         status: true,
//         message: "파일이 업로드 되었습니다.",
//         data: {
//           name: f.name,
//           mimetype: f.mimetype,
//           size: f.size,
//         },
//       });
//     });
//   } catch (err) {
//     console.log("500_SERVER_INTERNAL_ERROR", err);
//     res.status(500).send({
//       status: false,
//       message: "파일 업로드 중 예외가 발생했습니다.",
//       error: err,
//     });
//   }
// });

var port = process.env.PORT || 6060;
// 개발용으로 임시로 8080으로 배포s
//실제 프로덕트용 port는 임시로 6060 으로 설정
//원래는 4040임.

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
  console.log(`Server is listening at localhost:{$port}`);
});
