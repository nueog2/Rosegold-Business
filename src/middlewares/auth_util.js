const jwt = require("../modules/jwt");
const message = require("../../config/message");
const secretKey = require("../../config/secret_key").secretKey;

async function verifyToken(req, res, next) {
  if (!req.cookies.access_token)
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_TOKEN"));
  var token = req.cookies.access_token;
  // "Bearer " 접두어가 있는 경우와 없는 경우를 나누어 처리하는 것 고려
  // 위에는 없는 case

  if (!token)
    return res.status(400).json({ message: "BAD_REQUEST", detail_cause: "" });

  jwt
    .verifyToken(token, secretKey)
    .then((response) => {
      if (
        !response.payload.id ||
        !response.payload.name ||
        !response.payload.user_id
      ) {
        return res
          .status(message["498_INVALID_TOKEN"].status)
          .send(message["498_INVALID_TOKEN"]);
      }

      req.user = response.payload;

      console.log("TOKEN_VERIFY_SUCCESS:", response);
      next();
    })
    .catch((error) => {
      console.error(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error), console.error(error);
    });
}

module.exports = {
  verifyToken,
};
