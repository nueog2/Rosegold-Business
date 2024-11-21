const message = require("../../config/message");
const models = require("../../models");
const { Moon_ChattingLog } = require("../models/moonlight_chat_log");

function createMoonlightChattingLog(req, res) {
  if (
    req.body.hotel_id == null ||
    req.body.foreign_text == null ||
    req.body.korean_text == null ||
    req.body.is_where == null ||
    req.body.foreign_lang == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  new Moon_ChattingLog()
    .create(
      req.body.hotel_id,
      req.body.foreign_text,
      req.body.korean_text,
      req.body.is_where,
      req.body.foreign_lang
    )
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function getMoonlightChattingLog(req, res) {
  new Moon_ChattingLog()
    .readMany(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function deleteMoonlightChattingLog(req, res) {
  if (req.body.moon_chat_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const moon_chat_log = new Moon_ChattingLog();
  moon_chat_log
    .delete(req.body.moon_chat_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status) return res.status(error.status).send(error);
      else return res.status(error.status).send(error);
    });
}

function deleteMoonlightChattingLogbyhotelID(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_HOTEL_ID"));
  }

  const moon_chat_log = new Moon_ChattingLog();
  moon_chat_log
    .deletebyhotel(req.query.hotel_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status) return res.status(error.status).send(error);
      else return res.status(error.status).send(error);
    });
}

module.exports = {
  createMoonlightChattingLog,
  getMoonlightChattingLog,
  deleteMoonlightChattingLog,
  deleteMoonlightChattingLogbyhotelID,
};
