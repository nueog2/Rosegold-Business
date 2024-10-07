const { create } = require("lodash");
const message = require("../../config/message");
const models = require("../../models");
const { ChattingLogFront } = require("../models/chatting_log_front");

function createChattingLogFront(req, res) {
  if (
    req.body.hotel_id == null ||
    req.body.question == null ||
    req.body.answer == null ||
    req.body.translated_question == null ||
    req.body.translated_answer == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const text = req.body.textContent.text;

  new ChattingLogFront()
    .create(req.body.hotel_id, req.body.event, req.body.user, text)
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

function sendChattingLogFront(req, res) {
  if (req.body.hotel_id == null || req.body.guest_num == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  new ChattingLogFront()
    .find_Guest(req.body.hotel_id, req.body.guest_num)
    .then((response) => {
      console.log(response);
      const user = response.user;

      new ChattingLogFront()
        .send(req.body.hotel_id, user, req.body.text)
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

function getChattingLogFront(req, res) {
  new ChattingLogFront()
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
  createChattingLogFront,
  sendChattingLogFront,
  getChattingLogFront,
};
