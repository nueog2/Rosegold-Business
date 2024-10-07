const models = require("../../models");
const message = require("../../config/message");

class ExQuestion {
  constructor() {}

  create(text, hotel_id) {
    return new Promise((resolve, reject) => {
      models.ex_question
        .create({
          text: text,
          hotel_id,
          hotel_id,
        })
        .then((response) => {
          if (response) {
            return resolve({
              // return resolve(message["200_SUCCESS"]);
              status: message["200_SUCCESS"].status,
              ex_question: response,
            });
          } else {
            return reject(
              message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
            );
          }
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

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.ex_question
        .findOne({ where: condition })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.ex_question = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "EX_QUESTION_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.ex_question
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.example_question = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "EXAMPLE_QUESTION_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  update(example_question_id, text) {
    return new Promise((resolve, reject) => {
      //   models.ex_question
      //     .readOne({ id: exameple_question_id })
      //     .then((response) => {
      models.ex_question
        .update(
          {
            text: text,
          },
          {
            where: {
              id: example_question_id,
            },
          }
        )
        .then(() => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
    // }).catch((error) => {
    //   console.log(error);
    //   return reject(error);
    // });
  }

  delete(example_question_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: example_question_id })
        .then((response) => {
          models.ex_question
            .destroy({
              where: {
                id: example_question_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              console.log(error);
              return reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }
}

module.exports = { ExQuestion };
