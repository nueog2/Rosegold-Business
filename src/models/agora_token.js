const AccessToken = require("../modules/rtctoken").AccessToken2;
const ServiceRtc = require("../modules/rtctoken").ServiceRtc;
const ServiceRtm = require("../modules/rtctoken").ServiceRtm;

const Role = {
  /**
   * RECOMMENDED. Use this role for a voice/video call or a live broadcast, if
   * your scenario does not require authentication for
   * [Co-host](https://docs.agora.io/en/video-calling/get-started/authentication-workflow?#co-host-token-authentication).
   */
  PUBLISHER: 1,

  /**
   * Only use this role if your scenario require authentication for
   * [Co-host](https://docs.agora.io/en/video-calling/get-started/authentication-workflow?#co-host-token-authentication).
   *
   * @note In order for this role to take effect, please contact our support team
   * to enable authentication for Hosting-in for you. Otherwise, Role_Subscriber
   * still has the same privileges as Role_Publisher.
   */
  SUBSCRIBER: 2,
};

class RtcTokenBuilder {
  /**
   * Builds an RTC token using an Integer uid.
   * @param {*} appId  The App ID issued to you by Agora.
   * @param {*} appCertificate Certificate of the application that you registered in the Agora Dashboard.
   * @param {*} channelName The unique channel name for the AgoraRTC session in the string format. The string length must be less than 64 bytes. Supported character scopes are:
   * - The 26 lowercase English letters: a to z.
   * - The 26 uppercase English letters: A to Z.
   * - The 10 digits: 0 to 9.
   * - The space.
   * - "!", "#", "$", "%", "&", "(", ")", "+", "-", ":", ";", "<", "=", ".", ">", "?", "@", "[", "]", "^", "_", " {", "}", "|", "~", ",".
   * @param {*} uid User ID. A 32-bit unsigned integer with a value ranging from 1 to (2^32-1).
   * @param {*} role See #userRole.
   * - Role.PUBLISHER; RECOMMENDED. Use this role for a voice/video call or a live broadcast.
   * - Role.SUBSCRIBER: ONLY use this role if your live-broadcast scenario requires authentication for [Co-host](https://docs.agora.io/en/video-calling/get-started/authentication-workflow?#co-host-token-authentication). In order for this role to take effect, please contact our support team to enable authentication for Co-host for you. Otherwise, Role_Subscriber still has the same privileges as Role_Publisher.
   * @param {*} tokenExpire epresented by the number of seconds elapsed since now. If, for example, you want to access the Agora Service within 10 minutes after the token is generated, set tokenExpire as 600(seconds)
   * @param {*} privilegeExpire represented by the number of seconds elapsed since now. If, for example, you want to enable your privilege for 10 minutes, set privilegeExpire as 600(seconds).
   * @return The RTC Token.
   */
  static buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    tokenExpire,
    privilegeExpire = 0
  ) {
    return this.buildTokenWithUserAccount(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      tokenExpire,
      privilegeExpire
    );
  }
}

module.exports.RtcTokenBuilder = RtcTokenBuilder;
module.exports.Role = Role;
