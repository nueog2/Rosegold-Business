const jwt = require("../modules/jwt");
const message = require("../../config/message");
const { Room, Message } = require("../models/hotel");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Role_Assign_Log = require("../models/hotel").Role_Assign_Log;
const Requirement_Log = require("../models/hotel").Requirement_Log;
const Chatting_Log = require("../models/chatting_log").ChattingLog;
const Work_Log = require("../models/work_log").Work_Log;

function loginByWorkerAccountInfo(req, res) {
  if (!req.query.user_id || !req.query.user_pwd) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const worker = new Worker();
  // const hotel = new Hotel();

  // hotel
  //   .readOne({ id: req.query.hotel_id })
  //   .then((hotel) => {
  //     if (!hotel) {
  //       return res
  //         .status(message["401_UNAUTHORIZED"].status)
  //         .send(
  //           message.issueMessage(message["401_UNAUTHORIZED"], "HOTEL_NOT_FOUND")
  //         );
  //     }

  console.log("hello");
  worker
    .readOne({
      user_id: req.query.user_id,
      user_pwd: req.query.user_pwd,
      // hotel_id: req.query.hotel_id,
    })
    .then((worker) => {
      if (!worker) {
        return res
          .status(message["401_UNAUTHORIZED"].status)
          .send(
            message.issueMessage(
              message["401_UNAUTHORIZED"],
              "WORKER_NOT_FOUND"
            )
          );
      }

      console.log(worker.worker.dataValues);

      return (
        res.status(message["200_SUCCESS"].status),
        res.send({
          message: "로그인이 성공적으로 처리되었습니다.",
          worker: worker.worker.dataValues,
        })
      );
    })
    .catch((error) => {
      console.log(error);
      if (error.status) {
        return res.status(error.status).send(error);
      } else {
        return res.status(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
      }
    });
}

function getTokensByWorkerAccountInfo(req, res) {
  if (!req.query.user_id || !req.query.user_pwd) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const worker = new Worker();
  // const hotel = new Hotel();

  // hotel.readOne({ id: req.query.hotel_id }).then((hotel) => {
  //   if (!hotel) {
  //     return res
  //       .status(message["401_UNAUTHORIZED"].status)
  //       .send(
  //         message.issueMessage(message["401_UNAUTHORIZED"], "HOTEL_NOT_FOUND")
  //       );
  //   }

  console.log("hello");
  worker
    .readOne({
      user_id: req.query.user_id,
      user_pwd: req.query.user_pwd,
    })
    .then((worker) => {
      if (!worker) {
        return res
          .status(message["401_UNAUTHORIZED"].status)
          .send(
            message.issueMessage(
              message["401_UNAUTHORIZED"],
              "WORKER_NOT_FOUND"
            )
          );
      }

      console.log(worker.worker.dataValues);

      // 사용자가 인증 후 JWT 토큰 발행
      jwt
        .signAccessToken({
          id: worker.worker.dataValues.id,
          name: worker.worker.dataValues.name,
          user_id: worker.worker.dataValues.user_id,
          // hotel_id: worker.worker.dataValues.hotel_id,
        })
        .then((response) => {
          // 토큰을 쿠키에 저장 및 클라이언트에게 반환
          return (
            res.cookie("access_token", response.access_token, {
              httpOnly: true,
            }),
            res.cookie("refresh_token", response.refresh_token, {
              httpOnly: true,
            }),
            res.status(message["200_SUCCESS"].status),
            res.send({
              message: "로그인이 성공적으로 처리되었습니다.",
              access_token: response.access_token,
              // hotel_id: worker.worker.dataValues.hotel_id,
              data: worker.worker.dataValues,
            })
          );
        })
        .catch((error) => {
          console.log(error);
          if (error.status) {
            return res.status(error.status).send(error);
          } else {
            return res.status(
              message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
            );
          }
        });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["401_UNAUTHORIZED"].status)
        .send(
          message.issueMessage(message["401_UNAUTHORIZED"], "WORKER_NOT_FOUND")
        );
    });
}

function getProfileByToken(req, res) {
  // if (!req.query.user_id || !req.query.user_pwd) {
  //   return res
  //     .status(message["401_UNAUTHORIZED"].status)
  //     .send(
  //       message.issueMessage(
  //         message["401_UNAUTHORIZED"],
  //         "ACCESS_TOKEN_NOT_FOUND"
  //       )
  //     );
  // }
  // if (!req.query.hotel_id) {
  //   return res
  //     .status(message["400_BAD_REQUEST"].status)
  //     .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_HOTEL_ID"));
  // }

  const accessToken = req.cookies.access_token;
  console.log(accessToken);

  if (!accessToken) {
    return res
      .status(message["401_UNAUTHORIZED"].status)
      .send(
        message.issueMessage(
          message["401_UNAUTHORIZED"],
          "ACCESS_TOKEN_NOT_FOUND"
        )
      );
  }

  jwt
    .verifyToken(accessToken)
    .then((response) => {
      const worker = new Worker();
      worker
        .readOne({ user_id: response.payload.user_id })
        .then((worker) => {
          if (!worker) {
            return res
              .status(message["401_UNAUTHORIZED"].status)
              .send(
                message.issueMessage(
                  message["401_UNAUTHORIZED"],
                  "WORKER_NOT_FOUND"
                )
              );
          }

          // if (req.query.hotel_id != response.payload.hotel_id) {
          //   return res
          //     .status(message["401_UNAUTHORIZED"].status)
          //     .send(
          //       message.issueMessage(
          //         message["401_UNAUTHORIZED"],
          //         "HOTEL_NOT_MATCH"
          //       )
          //     );
          // }

          console.log(worker.worker.dataValues);
          console.log("200_LOGIN_SUCCESS");

          return res.status(message["200_SUCCESS"].status).send({
            status: true,
            message: "LOGIN_SUCCESS",
            data: worker.worker.dataValues,
          });
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(message["401_UNAUTHORIZED"].status)
            .send(
              message.issueMessage(
                message["401_UNAUTHORIZED"],
                "WORKER_NOT_FOUND"
              )
            );
        });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["498_INVALID_TOKEN"].status)
        .send(
          message.issueMessage(message["498_INVALID_TOKEN"], "INVALID_TOKEN")
        );
    });
}

module.exports = {
  loginByWorkerAccountInfo,
  getTokensByWorkerAccountInfo,
  getProfileByToken,
};
