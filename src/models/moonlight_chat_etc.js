const models = require("../../models");
const message = require("../../config/message");

class Moon_ChattingLog_Etcv {
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
}
