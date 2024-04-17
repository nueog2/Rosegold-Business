const models = require("../../models");
const message = require("../../config/message");

class ChattingLog {
  constructor() {}

  create(room_id, question, answer, req_log_created) {
    return new Promise((resolve, reject) => {
      models.chatting_log
        .create({
          room_id: room_id,
          question: question,
          answer: answer,
          req_log_created: req_log_created,
        })
        .then((response) => {
          if (response) return resolve(message["200_SUCCESS"]);
          else
            return reject(
              message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
            );
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.chatting_log
        .findAll({
          where: condition,
          attributes: [
            "id",
            "question",
            "answer",
            "room_id",
            "createdAt",
            //"department_name",
            "req_log_created",
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.chatting_logs = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "CHATTING_LOG_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }
}

module.exports = {
  ChattingLog,
};
