const models = require("../../models");
const message = require("../../config/message");

class ChattingLogFront {
  contructor() {}

  create(
    hotel_id,
    user,
    question,
    answer,
    translated_question,
    translated_answer
  ) {
    return new Promise((resolve, reject) => {
      const findOrCreateGuestNum = async () => {
        const existingGuest = await models.chatting_log_front.findOne({
          where: {
            hotel_id: hotel_id,
            user: user,
          },
          order: [["guest_num", "DESC"]],
        });

        if (existingGuest) {
          return existingGuest.guest_num;
        } else {
          const maxGuestNum = await models.chatting_log_front.max("guest_num", {
            where: {
              hotel_id: hotel_id,
            },
          });

          return maxGuestNum ? maxGuestNum + 1 : 1;
        }
      };

      findOrCreateGuestNum()
        .then((guest_num) => {
          models.chatting_log_front
            .create({
              hotel_id: hotel_id,
              user: user,
              guest_num: guest_num,
              question: question,
              answer: answer,
              translated_question: translated_question,
              translated_answer: translated_answer,
            })
            .then((response) => {
              return resolve({
                status: message["200_SUCCESS"].status,
                chatting_log_front: response,
              });
            })
            .catch((error) => {
              return reject(error);
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  find_Guest() {
    return new Promise((resolve, reject) => {
      models.chatting_log_front
        .findOne({
          where: {
            hotel_id: hotel_id,
            guest_num: guest_num,
          },
          attributes: ["user"],
        })
        .then((response) => {
          return resolve({
            status: message["200_SUCCESS"].status,
            user: response.user,
          });
        })
        .catch((error) => {
          return reject({
            status: error.status,
            error: error,
          });
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.chatting_log_front
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.chatting_log_fronts = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "POTENTIAL_CHAT_LOG_NOT_FOUND"
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
}

module.exports = {
  ChattingLogFront,
};
