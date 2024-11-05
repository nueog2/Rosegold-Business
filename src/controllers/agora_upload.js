var admin = require("firebase-admin");
const { Buffer } = require("buffer");
const moment = require("moment");

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
    console.error("Error uploading files:", error);
    return res.status(500).send("Internal server error."); // 에러 발생 시 500 에러 반환
  }
}

// const message = require("../../config/message");
// const { db, storageRef, getFirestore } = require("../firebase.js");
// const { collection, addDoc } = require("firebase/firestore");

// function uploadCustomerFilestoFbStorage(req, res) {
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(message.issueMessage(message["400_BAD_REQUEST"], "FILE_NOT_FOUND"));
//   }

//   const uploadedFiles = [];

//   const uploadPromises = []; // Promise들을 저장할 배열

//   // 여러 파일 업로드 처리 (req.files가 객체일 경우)
//   if (typeof req.files === "object") {
//     for (const key in req.files) {
//       const file = req.files[key];
//       const fileRef = storageRef.child(file.name);
//       const uploadPromise = uploadBytes(fileRef, file.data).then((snapshot) => {
//         // 각 파일 업로드 후, URL을 가져와서 uploadedFiles 배열에 추가
//         return snapshot.ref.getDownloadURL().then((url) => {
//           uploadedFiles.push({
//             name: snapshot.metadata.name,
//             fullPath: snapshot.metadata.fullPath,
//             url: url,
//           });
//         });
//       });

//       uploadPromises.push(uploadPromise);
//     }
//   } else {
//     // 단일 파일 업로드 처리
//     const file = req.files;
//     const fileRef = storageRef.child(file.name);
//     const uploadPromise = uploadBytes(fileRef, file.data).then((snapshot) => {
//       return snapshot.ref.getDownloadURL().then((url) => {
//         uploadedFiles.push({
//           name: snapshot.metadata.name,
//           fullPath: snapshot.metadata.fullPath,
//           url: url,
//         });
//       });
//     });
//     uploadPromises.push(uploadPromise);
//   }

//   Promise.all(uploadPromises)
//     .then(() => {
//       res
//         .status(message["200_SUCCESS"])
//         // .send("FILE_UPLOAD_SUCCESS")
//         .json({
//           message: message["200_SUCCESS"].message, // message 객체에서 메시지 가져오기
//           uploadedFiles,
//         });
//     })
//     .catch((error) => {
//       console.error("ERROR DURING UPLOADING FILES:", error);
//       res
//         .status(message["500_SERVER_INTERNAL_ERROR"])
//         .send("FILE_UPLOAD_FAILED");
//     });
// }

// // 다른 컨트롤러 함수들
// function otherControllerFunction1(req, res) {}

module.exports = {
  // addToFirestore,
  uploadCustomerFilestoFbStorage,
  // otherControllerFunction1,
};
