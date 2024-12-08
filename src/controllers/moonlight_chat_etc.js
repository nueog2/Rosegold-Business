const message = require("../../config/message");

const models = require("../../models");
const { Moon_ChattingLog_Etc } = require("../models/moonlight_chat_etc");

function createMoonlightChattingLog_Etc(req, res) {
  if (
    req.body.hotel_id == null
    // req.body.question == null ||
    // req.body.answer == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  new Moon_ChattingLog_Etc()
    .create(
      req.body.hotel_id,
      req.body.question || null,
      req.body.answer || null
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

function getMoonlightChattingLog_Etc(req, res) {
  new Moon_ChattingLog_Etc()
    .readMany(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function deleteMoonlightChattingLog_Etc(req, res) {
  if (req.body.moon_chat_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const moon_chat_etc = new Moon_ChattingLog_Etc();
  moon_chat_etc
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

function deleteMoonlightChattingLog_EtcbyhotelID(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_HOTEL_ID"));
  }

  const moon_chat_etc = new Moon_ChattingLog_Etc();
  moon_chat_etc
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
  createMoonlightChattingLog_Etc,
  getMoonlightChattingLog_Etc,
  deleteMoonlightChattingLog_Etc,
  deleteMoonlightChattingLog_EtcbyhotelID,
};
