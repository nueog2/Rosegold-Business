const message = require("../../config/message");
const models = require("../../models");
const { ChattingLog } = require("../models/chatting_log");
const { ChattingLogDB } = require("../models/chatting_log_db");
const { Room, Requirement_Log, Hotel } = require("../models/hotel");

function getChattingLogfromDB(req, res) {
  //   const { room_id } = req.query;
  //   if (!room_id) {
  //     return res.status(400).json(message.issueMessage(message["400_BAD_REQUEST"]));
  //   }
  const chatting_log_db = new ChattingLogDB();

  chatting_log_db
    .readMany({})
    .then((chattingLog) => {
      if (!chattingLog) {
        return res
          .status(message["404_NOT_FOUND"].status)
          .send(message.issueMessage(message["404_NOT_FOUND"]));
      }
      return res.status(message["200_SUCCESS"].status).send({
        status: message["200_SUCCESS"].status,
        chattingLog,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(error.status).send(error);
    });
}

function getChattingLogfromDBbyHotel(req, res) {
  //   const { room_id } = req.query;
  //   if (!room_id) {
  //     return res.status(400).json(message.issueMessage(message["400_BAD_REQUEST"]));
  //   }
  const chatting_log_db = new ChattingLogDB();

  chatting_log_db
    .readMany({ hotel_id: req.query.hotel_id })
    .then((chattingLog) => {
      if (!chattingLog) {
        return res
          .status(message["404_NOT_FOUND"].status)
          .send(message.issueMessage(message["404_NOT_FOUND"]));
      }
      return res.status(message["200_SUCCESS"].status).send({
        status: message["200_SUCCESS"].status,
        chattingLog,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(error.status).send(error);
    });
}

module.exports = { getChattingLogfromDB, getChattingLogfromDBbyHotel };
