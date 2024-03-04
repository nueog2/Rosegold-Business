const message = require("../../config/message");
const ChattingLog = require("../models/chatting_log").ChattingLog;
const { Room } = require("../models/hotel");

function createChattingLog(req, res) {
  if (
    req.body.question == null ||
    req.body.answer == null ||
    req.body.room_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  //[TODO]
  // 2. 추후 LLM + RAG AI Chatbot Server와 연동 시 room_id가 속해 있는 호텔의 부서명으로 Filter 처리 하는 로직 추가

  new Room()
    .readOne({
      id: req.body.room_id,
    })
    .then((response) => {
      new ChattingLog()
        .create(req.body.room_id, req.body.question, req.body.answer)
        .then((response) => {
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          if (error.status) return res.status(error.status).send(error);
          else
            return res
              .status(message["500_SERVER_INTERNAL_ERROR"].status)
              .send(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
        });
    })
    .catch((error) => {
      if (error.status) return res.status(error.status).send(error);
      else
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
    });
}

function getChattingLog(req, res) {
  if (req.query.room_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  //[TODO]
  // 1. Room CRUD API 개발 완료되면 room_id에 해당되는 Room의 호텔의 Checkin date와 Checkout date Filter 처리하는 로직 추가
  const chatting_log = new ChattingLog();
  const room = new Room();

  room
    .readOne({ id: req.query.room_id })
    .then((response) => {
      chatting_log
        .readMany({ room_id: req.query.room_id })
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
  createChattingLog,
  getChattingLog,
};
