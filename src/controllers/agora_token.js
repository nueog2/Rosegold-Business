const RtcTokenBuilder = require("../models/agora_token").RtcTokenBuilder;
const RtcRole = require("../models/agora_token").Role;
const message = require("../../config/message");

// Need to set environment variable AGORA_APP_ID
const appId = process.env.AGORA_APP_ID;
// Need to set environment variable AGORA_APP_CERTIFICATE
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

// 채널에 대한 정보 : 채널명(호텔마다 고유해야 함), APP ID, APP CERTIFICATE
//
// const channelName = "7d72365eb983485397e3e3f9d460bdda"; // 채널명(호텔마다 고유해야 함)-> 수정 예정

// const uid = 2882341273;
// const account = "2882341273";
const role = RtcRole.PUBLISHER;
const tokenExpirationInSecond = 3600;
const privilegeExpirationInSecond = 3600;
// const joinChannelPrivilegeExpireInSeconds = 3600;
// const pubAudioPrivilegeExpireInSeconds = 3600;
// const pubVideoPrivilegeExpireInSeconds = 3600;
// const pubDataStreamPrivilegeExpireInSeconds = 3600;

console.log("App Id:", appId);
console.log("App Certificate:", appCertificate);
if (
  appId == undefined ||
  appId == "" ||
  appCertificate == undefined ||
  appCertificate == ""
) {
  console.log(
    "Need to set environment variable AGORA_APP_ID and AGORA_APP_CERTIFICATE"
  );
  process.exit(1);
}

// // Build token with uid
// const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(
//   appId,
//   appCertificate,
//   channelName,
//   uid,
//   role,
//   tokenExpirationInSecond,
//   privilegeExpirationInSecond
// );
// console.log("Token with int uid:", tokenWithUid);

function createAgoraToken(req, res) {
  const channelName = req.query.channel_name;
  const uid = req.query.uid;

  try {
    const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      tokenExpirationInSecond,
      privilegeExpirationInSecond
    );

    console.log("Token with int uid:", tokenWithUid);
    return res.status(200).json({ token: tokenWithUid });
  } catch (error) {
    console.error(error);
    return res.status(error).send(error);
  }
}

// const generateRTCToken = (req, resp) => {
//     resp.header('Access-Control-Allow-Origin', '*');
//     const channelName = req.params.channel;
//     //채널 이름 실제로는 서버에 업로드 되어 있는 것을 가져와야 함
//     if (!channelName) {
//         return resp.status(500).json({ 'error': 'channel is required' });
//     }
//     let uid = req.params.uid;
//     if(!uid || uid === '') {
//         return resp.status(500).json({ 'error': 'uid is required' });
//     }
//     // get role
//     let role;
//     if (req.params.role === 'publisher') { //무조건 publisher로 받아야 통화가 된다
//         role = RtcRole.PUBLISHER;
//     } else if (req.params.role === 'audience') { //audience는 청취만...
//         role = RtcRole.SUBSCRIBER
//     } else {
//         return resp.status(500).json({ 'error': 'role is incorrect' });
//     }
//     let expireTime = req.query.expiry;
//     if (!expireTime || expireTime === '') {
//         expireTime = 3600; //따로 설정 안 하면 토큰 만료 시간 1시간으로 설정
//     } else {
//         expireTime = parseInt(expireTime, 10);
//     }
//     const currentTime = Math.floor(Date.now() / 1000); //현재 시간
//     const privilegeExpireTime = currentTime + expireTime; //만료 시간
//     let token;
//     if (req.params.tokentype === 'userAccount') { //계정 기반 토큰 발급 (안 쓸거임)
//         token = RtcTokenBuilder.buildTokenWithAccount(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
//     } else if (req.params.tokentype === 'uid') { //uid 기반 토큰 발급 (이거 쓸거임)
//         token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channelName, uid, role, privilegeExpireTime);
//     } else {
//         return resp.status(500).json({ 'error': 'token type is invalid' });
//     }
//     return resp.json({ 'rtcToken': token });
// }

module.exports = {
  createAgoraToken,
};
