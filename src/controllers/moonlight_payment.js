var admin = require("firebase-admin");
const { Buffer } = require("buffer");
const moment = require("moment");
const message = require("../../config/message");
const Moonlight_Payment =
  require("../models/moonlight_payment").Moonlight_Payment;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "gs://rosegold-app.appspot.com/customer",
// });
// gs://rosegold-app.appspot.com/customer -> hotel.js 에 위치

var bucket = admin.storage().bucket();

// bucket.upload("/Users/megoe/Pictures/Screenshots/food1.png");

// bucket.upload("/Users/megoe/Pictures/Screenshots/food1.png", {
//   destination: "customer/food1.png", // 폴더 경로 포함
// });

// 결제 정보 저장 및 서명 데이터(.bmp)파일 FB 저장소에 업로드드
async function uploadPayment_InfoFbStorage(req, res) {
  try {
    const hotelId = req.body.hotel_id;
    if (!hotelId) {
      return res.status(400).send("hotel_id is required.");
    }

    if (!req.files || !req.files.length) {
      return res.status(400).send("No files uploaded.");
    }

    const dateString = moment().format("YYMMDD");
    const uploadedFiles = [];
    const downloadURLarray = [];
    const ApprNo = req.body.apprNo;

    const uploadPromises = req.files.map((file) => {
      const destination = `customer/hotel${hotelId}/${dateString}/${ApprNo}`;
      const blob = bucket.file(destination);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: file.mimetype,
        },
      });

      return new Promise((resolve, reject) => {
        blobStream.on("error", (err) => {
          console.error("Error uploading file:", err);
          reject(err);
        });

        blobStream.on("finish", async () => {
          try {
            const [metadata] = await blob.getMetadata();
            const downloadURL = metadata.mediaLink;

            await blob.setMetadata({
              acl: [
                {
                  entity: "allUsers",
                  role: "READER",
                },
              ],
            });

            uploadedFiles.push({ name: ApprNo, url: downloadURL });
            downloadURLarray.push(downloadURL);
            resolve();
          } catch (error) {
            reject(error); // 메타데이터 가져오기 실패 시 reject
          }
        });

        blobStream.end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);

    // const names = req.body.name.split(",").map((name) => name.trim());

    const moonlight_pay = new Moonlight_Payment();
    const response = await moonlight_pay.create(
      hotelId,
      req.body.apprNo,
      req.body.apprDate,
      req.body.cardNum,
      req.body.cardName,
      req.body.acquirerName,
      req.body.issuerCode,
      req.body.acquirerCode,
      req.body.merchantNumber,
      req.body.message,
      req.body.notice,
      downloadURLarray
    );

    console.log(response);

    return res.status(200).json({
      moonlight_payment: response,
      uploadedFiles: uploadedFiles,
    });
  } catch (error) {
    console.error("ERROR UPLOADING FILES:", error);
    return res.status(500).send("SERVER_INTERNAL_ERROR");
  }
}

function getPayment_InfoMany(req, res) {
  const moonlight_pay = new Moonlight_Payment();
  moonlight_pay
    .readMany(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getPayment_InfoOne(req, res) {
  const moonlight_pay = new Moonlight_Payment();
  moonlight_pay
    .readOne(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function deletePayment_Info(req, res) {
  const moonlight_pay = new Moonlight_Payment();
  moonlight_pay
    .delete(req.body.moonlight_pay_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

module.exports = {
  uploadPayment_InfoFbStorage,
  getPayment_InfoMany,
  getPayment_InfoOne,
  deletePayment_Info,
};
