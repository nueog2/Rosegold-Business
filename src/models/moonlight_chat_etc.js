const message = require("../../config/message");
const models = require("../../models");

class Moon_ChattingLog_Etc {
  constructor() {}

  create(hotel_id, question, answer) {
    return new Promise((resolve, reject) => {
      models.moonlight_chat_etc
        .create({
          hotel_id: hotel_id,
          question: question,
          answer: answer,
        })
        .then((response) => {
          return resolve({
            status: message["200_SUCCESS"].status,
            moon_chat_etc: response,
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
      models.moonlight_chat_etc
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.moonlight_chat_etc = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "MOONLIGHT_CHAT_LOG_ETC_NOT_FOUND"
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
          models.moonlight_chat_etc
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
      models.moonlight_chat_etc
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
  Moon_ChattingLog_Etc,
};
