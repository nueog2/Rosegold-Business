// // import { initializeApp, getApp, getApps } from "firebase/app";
// // import { getFirestore } from "firebase/firestore"; 파이어 스토어 사용시
// // import { getAuth } from "firebase/auth"; 인증 사용시

// // const { initializeApp } = require("firebase/app");
// const { getFirestore } = require("firebase/firestore");
// const { getStorage, ref, uploadBytes } = require("firebase/storage");

// // 파이어베이스 Config
// const firebaseConfig = {
//   apiKey: process.env.NODE_APP_FB_API_KEY,
//   authDomain: process.env.NODE_APP_FB_AUTH_DOMAIN,
//   projectId: process.env.NODE_APP_FB_PROJECT_ID,
//   storageBucket: process.env.NODE_APP_FB_STORAGE_BUCKET,
//   messagingSenderId: process.env.NODE_APP_FB_MESSAGE_ID,
//   appId: process.env.NODE_APP_FB_APP_ID,
// };

// // 파이어베이스 앱 초기화/설정 (이미 초기화되어있으면 기존 설정 사용)

// // const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const storageRef = ref(storage);

// module.exports = {
//   db,
//   storage,
//   storageRef,
//   getStorage,
//   uploadBytes,
//   getFirestore,
// };
