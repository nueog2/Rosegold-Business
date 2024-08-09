const message = require("../../config/message");
const models = require("../../models");
const { ChattingLog } = require("../models/chatting_log");
const { Room, Requirement_Log, Hotel } = require("../models/hotel");

function createChattingLog(req, res) {
  if (
    req.body.room_id == null ||
    req.body.question == null ||
    req.body.answer == null ||
    req.body.translated_question == null ||
    req.body.translated_answer == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  new Room()
    .readOne({
      id: req.body.room_id,
    })
    .then((response) => {
      const room_name = response.room.dataValues.name;
      const hotel_id = response.room.dataValues.hotel_id;

      // identifier 생성
      // const identifier = Date.now();

      const req_log_created =
        req.body.department_name != null && req.body.summarized_sentence != null
          ? 1
          : 0;
      new ChattingLog()
        .create(
          req.body.room_id,
          room_name,
          hotel_id,
          req.body.question,
          req.body.answer,
          req.body.translated_question,
          req.body.translated_answer,
          req_log_created
          // identifier
        )
        .then((response) => {
          console.log("\n\n\n", response, "\n\n\n");
          const chatting_log_id = response.chatting_log.id;
          // console.log(
          //   "\n\n\n chatting_log_id :",
          //   response.chatting_log.id,
          //   "\n\n\n"
          // );
          // const identifier = response.chatting_log.id;

          if (
            req.body.department_name != null &&
            req.body.summarized_sentence != null
          ) {
            if (
              req.body.requirement_id != null &&
              req.body.requirement_menu_created == 1
            ) {
              new ChattingLog().updateidentifier(
                req.body.requirement_id,
                chatting_log_id
              );
              console.log("IDENTIFIER UPDATED - AFTER MENU REQ CREATED");
              return res.status(response.status).send(response);
            }

            new Requirement_Log()
              .create(
                req.body.room_id,
                req.body.question,
                req.body.answer,
                req.body.department_name,
                req.body.summarized_sentence
                // identifier
              )
              .then((response) => {
                const identifier = response.requirement_log.id;
                new Requirement_Log()
                  .updateidentifier(identifier, response.requirement_log.id)
                  .then(() => {
                    new ChattingLog().updateidentifier(
                      identifier,
                      chatting_log_id
                    );
                    console.log("IDENTIFIER UPDATED");
                    return res.status(response.status).send(response);
                  });
                // return res.status(response.status).send(response);
                // .send({
                //   status: "Success",
                //   message: "REQUIREMENT_LOG_CREATED",
                //   data: response,
                // });
              });
          } else {
            return res.status(response.status).send(response);
          }
        })
        .catch((error) => {
          console.log(error);
          return res.status(error.status).send(error);
        });
    })

    .catch((error) => {
      console.log(error);
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
  if (req.query.room_name == null || req.query.hotel_id == null) {
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
  const hotel = new Hotel();

  room
    .readOne({ name: req.query.room_name, hotel_id: req.query.hotel_id })
    .then((response) => {
      console.log(response);
      const hotel = new Hotel();
      hotel
        .readOne({ id: response.room.dataValues.hotel_id })
        .then((response) => {
          console.log(response);
          const currentDate = new Date();
          const checkinDate = new Date(response.hotel.checkin_date);
          const checkoutDate = new Date(response.hotel.checkout_date);

          if (currentDate >= checkinDate && currentDate <= checkoutDate) {
            const chatting_log = new ChattingLog();
            chatting_log
              .readMany({
                room_name: req.query.room_name,
                hotel_id: req.query.hotel_id,
              })
              .then((response) => {
                console.log(response);
                return res.status(response.status).send(response);
              })
              .catch((error) => {
                if (!error.status)
                  return res
                    .status(message["400_BAD_REQUEST"].status)
                    .send(
                      message.issueMessage(
                        message["400_BAD_REQUEST"],
                        "CHATTING_LOG_NOT_FOUND"
                      )
                    );
                else return res.status(error.status).send(error);
              });
          } else
            return res
              .status(message["400_BAD_REQUEST"].status)
              .send(
                message.issueMessage(
                  message["400_BAD_REQUEST"],
                  "NOT_IN_CHECKIN_CHECKOUT_PERIOD"
                )
              );
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

function getChattingLogbyidentifier(req, res) {
  if (
    req.query.room_name == null ||
    req.query.hotel_id == null ||
    req.query.identifier == null
  ) {
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
  const hotel = new Hotel();

  room
    .readOne({ name: req.query.room_name, hotel_id: req.query.hotel_id })
    .then((response) => {
      console.log(response);
      const hotel = new Hotel();
      hotel
        .readOne({ id: response.room.dataValues.hotel_id })
        .then((response) => {
          console.log(response);
          const currentDate = new Date();
          const checkinDate = new Date(response.hotel.checkin_date);
          const checkoutDate = new Date(response.hotel.checkout_date);

          if (currentDate >= checkinDate && currentDate <= checkoutDate) {
            const chatting_log = new ChattingLog();
            chatting_log
              .readMany({
                identifier: req.query.identifier,
              })
              .then((response) => {
                console.log(response);
                return res.status(response.status).send(response);
              })
              .catch((error) => {
                if (!error.status)
                  return res
                    .status(message["400_BAD_REQUEST"].status)
                    .send(
                      message.issueMessage(
                        message["400_BAD_REQUEST"],
                        "CHATTING_LOG_NOT_FOUND"
                      )
                    );
                else return res.status(error.status).send(error);
              });
          } else
            return res
              .status(message["400_BAD_REQUEST"].status)
              .send(
                message.issueMessage(
                  message["400_BAD_REQUEST"],
                  "NOT_IN_CHECKIN_CHECKOUT_PERIOD"
                )
              );
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
  getChattingLogbyidentifier,
};
