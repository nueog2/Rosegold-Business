const models = require("../../models");
const message = require("../../config/message");

class Moon_ChattingLog {
  constructor() {}

  create(hotel_id, foreign_text, korean_text, is_where, foreign_lang) {
    return new Promise((resolve, reject) => {
      models.moonlight_chat_log
        .create({
          hotel_id: hotel_id,
          foreign_text: foreign_text,
          korean_text: korean_text,
          is_where: is_where,
          foreign_lang: foreign_lang,
        })
        .then((response) => {
          return resolve({
            status: message["200_SUCCESS"].status,
            moon_chat_log: response,
          });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.moonlight_chat_log
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.moonlight_chat_logs = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "MOONLIGHT_CHAT_LOG_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject({
            status: error.status,
            error: error,
          });
        });
    });
  }

  delete(moon_chat_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: moon_chat_id })
        .then((response) => {
          models.moonlight_chat_log
            .destroy({
              where: {
                id: moon_chat_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  deletebyhotel(hotel_id) {
    return new Promise((resolve, reject) => {
      //   this.readOne({ id: hotel_id })
      // .then((response) => {
      models.moonlight_chat_log
        .destroy({
          where: {
            hotel_id: hotel_id,
          },
        })
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    }).catch((error) => {
      return reject(error);
    });
  }
}

module.exports = {
  Moon_ChattingLog,
};
