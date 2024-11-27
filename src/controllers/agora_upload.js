var admin = require("firebase-admin");
const { Buffer } = require("buffer");
const moment = require("moment");
const message = require("../../config/message");
const Moonlight_Guest = require("../models/moonlight_guest").Moonlight_Guest;

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

// async function uploadCustomerFilestoFbStorage(req, res) {
//   try {
//     const hotelId = req.body.hotel_id;
//     if (!hotelId) {
//       return res.status(400).send("hotel_id is required.");
//     }

//     if (!req.files || !req.files.length) {
//       return res.status(400).send("No files uploaded.");
//     }

//     const dateString = moment().format("YYMMDD"); // 날짜 문자열 생성
//     const uploadedFiles = [];

//     const uploadPromises = req.files.map(async (file) => {
//       const destination = `customer/hotel${hotelId}/${dateString}/${file.originalname}`;
//       const blob = bucket.file(destination);
//       const blobStream = blob.createWriteStream({
//         metadata: {
//           contentType: file.mimetype,
//         },
//       });

//       blobStream.on("error", (err) => {
//         console.error("Error uploading file:", err);
//         throw err;
//       });

//       blobStream.on("finish", async () => {
//         const [metadata] = await blob.getMetadata();
//         const downloadURL = metadata.mediaLink; // 다운로드 URL

//         uploadedFiles.push({ name: file.originalname, url: downloadURL });
//       });

//       return new Promise((resolve, reject) => {
//         blobStream.end(file.buffer, () => {
//           resolve();
//         });
//       });
//     });

//     await Promise.all(uploadPromises);

//     return res.status(200).json({ uploadedFiles });
//   } catch (error) {
//     console.error("Error uploading files:", error);
//     res.status(500).send("Internal server error.");
//   }
// }

async function uploadCustomerFilestoFbStorage(req, res) {
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

    const uploadPromises = req.files.map((file) => {
      const destination = `customer/hotel${hotelId}/${dateString}/${file.originalname}`;
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

            uploadedFiles.push({ name: file.originalname, url: downloadURL });
            resolve();
          } catch (error) {
            reject(error); // 메타데이터 가져오기 실패 시 reject
          }
        });

        blobStream.end(file.buffer);
      });
    });

    await Promise.all(uploadPromises);
    return res.status(200).json({ uploadedFiles });
  } catch (error) {
    console.error("ERROR UPLOADING FILES:", error);
    return res.status(500).send("SERVER_INTERNAL_ERROR"); // 에러 발생 시 500 에러 반환
  }
}

async function uploadCustomerFilestoFbStoragewithGuest(req, res) {
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

    const uploadPromises = req.files.map((file) => {
      const destination = `customer/hotel${hotelId}/${dateString}/${file.originalname}`;
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

            uploadedFiles.push({ name: file.originalname, url: downloadURL });
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

    const names = req.body.name.split(",").map((name) => name.trim());

    const moonlight_guest = new Moonlight_Guest();
    const response = await moonlight_guest.create(
      // await 추가
      hotelId,
      names,
      req.body.num_guest,
      req.body.room_id,
      req.body.process,
      downloadURLarray
    );

    console.log(response);

    return res.status(200).json({
      moonlight_guest: response,
      uploadedFiles: uploadedFiles,
    });
  } catch (error) {
    console.error("ERROR UPLOADING FILES:", error);
    return res.status(500).send("SERVER_INTERNAL_ERROR");
  }
}

module.exports = {
  // addToFirestore,
  uploadCustomerFilestoFbStorage,
  uploadCustomerFilestoFbStoragewithGuest,
  // otherControllerFunction1,
};
