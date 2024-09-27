const { create } = require("lodash");
const message = require("../../config/message");
const models = require("../../models");
const { ChattingLogGuest } = require("../models/chatting_log_guest");
const jwt = require("../modules/jwt");

function createChattingLogGuest_Naver(req, res) {
  if (
    req.query.hotel_id == null ||
    req.body.event == null ||
    req.body.user == null ||
    req.body.textContent.text == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const text = req.body.textContent.text;

  new ChattingLogGuest()
    .create_Naver(req.query.hotel_id, req.body.event, req.body.user, text)
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status) {
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      } else return res.status(error.status).send(error);
    });
}

function sendChattingLogGuest_Naver(req, res) {
  if (req.body.hotel_id == null || req.body.guest_num == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  new ChattingLogGuest()
    .find_Guest(req.body.hotel_id, req.body.guest_num)
    .then((response) => {
      console.log(response);
      const user = response.user;

      new ChattingLogGuest()
        .send_Naver(req.body.hotel_id, user, req.body.text)
        .then((response) => {
          console.log(response);
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          console.log(error);
          if (!error.status) {
            return res
              .status(message["500_SERVER_INTERNAL_ERROR"].status)
              .send(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
          } else return res.status(error.status).send(error);
        });
    });
}

// function getChattingLogGuest_Naver(req, res) {
//   new ChattingLogGuest()
//     .readMany(req.query)
//     .then((response) => {
//       return res.status(response.status).send(response);
//     })
//     .catch((error) => {
//       console.log(error);
//       if (!error.status)
//         return res
//           .status(message["500_SERVER_INTERNAL_ERROR"].status)
//           .send(
//             message.issueMessage(
//               message["500_SERVER_INTERNAL_ERROR"],
//               "UNDEFINED_ERROR"
//             )
//           );
//       else return res.status(error.status).send(error);
//     });
// }

function createChattingLogGuest_Kakao(req, res) {
  if (
    req.query.hotel_id == null ||
    // req.body.event or skill
    req.body.userRequest.user.id == null ||
    req.body.userRequest.utterance == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const text = req.body.userRequest.utterance;
  const user = req.body.userRequest.user.id;

  new ChattingLogGuest()
    .create_Kakao(req.query.hotel_id, user, text)
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.stauts).send(error);
    });
}

function sendChattingLogGuest_Kakao(req, res) {
  if (
    req.body.hotel_id == null ||
    req.body.guest_num == null ||
    req.body.text
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETRES")
      );
  }

  new ChattingLogGuest()
    .find_Guest(req.body.hotel_id, req.body.guest_num)
    .then((response) => {
      console.log(respsone);
      const user = response.user;

      new ChattingLogGuest()
        .send_Kakao(req.body.hotel_id, user, req.body.text)
        .then((response) => {
          console.log(response);
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          console.log(error);
          return res.status(error.status).send(error);
        });
    });
}

const cookieParser = require("cookie-parser");

function generateToken() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

function createTokensforGuest(req, res) {
  console.log("hello");

  const Token = generateToken();
  // .then(() => {
  // 토큰을 쿠키에 저장 및 클라이언트에게 반환
  return (
    res.cookie("guest_token", Token, {
      httpOnly: true,
    }),
    res.status(message["200_SUCCESS"].status),
    res.send({
      message: "게스트용 토큰이 발급이 되었습니다.",
      guest_token: Token,
    })
  );
  // })
  // .catch((error) => {
  //   console.log(error);
  //   if (error.status) {
  //     return res.status(error.status).send(error);
  //   } else {
  //     return res.status(
  //       message.issueMessage(
  //         message["500_SERVER_INTERNAL_ERROR"],
  //         "UNDEFINED_ERROR"
  //       )
  //     );
  //   }
  // });
}

function createChattingLogGuest_Page(req, res) {
  if (
    req.body.hotel_id == null ||
    req.body.event == null ||
    req.body.user == null ||
    req.body.text == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const text = req.body.text;

  new ChattingLogGuest()
    .create_Page(req.body.hotel_id, req.body.event, req.body.user, text)
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status) {
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      } else return res.status(error.status).send(error);
    });
}

// function sendChattingLogGuest_Page(req, res) {
//   if (req.body.hotel_id == null || req.body.guest_num == null) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   new ChattingLogGuest()
//     .find_Guest(req.body.hotel_id, req.body.guest_num)
//     .then((response) => {
//       console.log(response);
//       const user = response.user;

//       new ChattingLogGuest()
//         .send_Page(req.body.hotel_id, user, req.body.text)
//         .then((response) => {
//           console.log(response);
//           return res.status(response.status).send(response);
//         })
//         .catch((error) => {
//           console.log(error);
//           if (!error.status) {
//             return res
//               .status(message["500_SERVER_INTERNAL_ERROR"].status)
//               .send(
//                 message.issueMessage(
//                   message["500_SERVER_INTERNAL_ERROR"],
//                   "UNDEFINED_ERROR"
//                 )
//               );
//           } else return res.status(error.status).send(error);
//         });
//     });
// }

function getChattingLogGuest_Many(req, res) {
  new ChattingLogGuest()
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

module.exports = {
  createChattingLogGuest_Naver,
  sendChattingLogGuest_Naver,
  // getChattingLogGuest_Naver,
  createChattingLogGuest_Kakao,
  sendChattingLogGuest_Kakao,
  createTokensforGuest,
  createChattingLogGuest_Page,
  getChattingLogGuest_Many,
};
