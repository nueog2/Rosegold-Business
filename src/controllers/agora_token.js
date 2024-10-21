const RtcTokenBuilder = require("../models/agora_token").RtcTokenBuilder;
const RtcRole = require("../models/agora_token").Role;
const message = require("../../config/message");

// Need to set environment variable AGORA_APP_ID
const appId = process.env.AGORA_APP_ID;
// Need to set environment variable AGORA_APP_CERTIFICATE
const appCertificate = process.env.AGORA_APP_CERTIFICATE;

// 채널에 대한 정보 : 채널명(호텔마다 고유해야 함), APP ID, APP CERTIFICATE

// const channelName = "7d72365eb983485397e3e3f9d460bdda"; // 채널명(호텔마다 고유해야 함)-> 수정 예정

const uid = 2882341273;
const account = "2882341273";
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

// Build token with uid
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

function createAgoraToken(req, req) {
  const channelName = req.body.channel_name;

  const tokenWithUid = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    tokenExpirationInSecond,
    privilegeExpirationInSecond
  )
    .then(() => {
      return res.status(tokenWithUid.status).send(tokenWithUid);
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
  createAgoraToken,
};
