// import { storageRef } from "../modules/firebase";
// import { uploadBytes } from "firebase/storage";
const uploadBytes = require("firebase/storage").uploadBytes;
const storageRef = require("../modules/firebase");
// import { storageRef } from "../modules/firebase.mjs";
const message = require("../../config/message");

function uploadCustomerFilestoFbStorage(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "FILE_NOT_FOUND"));
  }

  const uploadedFiles = [];

  const uploadPromises = []; // Promise들을 저장할 배열

  // 여러 파일 업로드 처리 (req.files가 객체일 경우)
  if (typeof req.files === "object") {
    for (const key in req.files) {
      const file = req.files[key];
      const fileRef = storageRef.child(file.name);
      const uploadPromise = uploadBytes(fileRef, file.data).then((snapshot) => {
        // 각 파일 업로드 후, URL을 가져와서 uploadedFiles 배열에 추가
        return snapshot.ref.getDownloadURL().then((url) => {
          uploadedFiles.push({
            name: snapshot.metadata.name,
            fullPath: snapshot.metadata.fullPath,
            url: url,
          });
        });
      });

      uploadPromises.push(uploadPromise);
    }
  } else {
    // 단일 파일 업로드 처리
    const file = req.files;
    const fileRef = storageRef.child(file.name);
    const uploadPromise = uploadBytes(fileRef, file.data).then((snapshot) => {
      return snapshot.ref.getDownloadURL().then((url) => {
        uploadedFiles.push({
          name: snapshot.metadata.name,
          fullPath: snapshot.metadata.fullPath,
          url: url,
        });
      });
    });
    uploadPromises.push(uploadPromise);
  }

  Promise.all(uploadPromises)
    .then(() => {
      res
        .status(message["200_SUCCESS"])
        // .send("FILE_UPLOAD_SUCCESS")
        .json({
          message: message["200_SUCCESS"].message, // message 객체에서 메시지 가져오기
          uploadedFiles,
        });
    })
    .catch((error) => {
      console.error("ERROR DURING UPLOADING FILES:", error);
      res
        .status(message["500_SERVER_INTERNAL_ERROR"])
        .send("FILE_UPLOAD_FAILED");
    });
}

// 다른 컨트롤러 함수들
function otherControllerFunction1(req, res) {
  // ...
}

module.exports = {
  uploadCustomerFilestoFbStorage,
  otherControllerFunction1,
};
