const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("./hotel");

class Chatbot_Docs extends Hotel {
  constructor() {
    super();
  }

  create(docs_dir, file_name, hotel_id) {
    return new Promise((resolve, reject) => {
      super
        .readOne(hotel_id)
        .then((response) => {
          models.chatbot_docs
            .create({
              docs_dir: docs_dir,
              file_name: file_name,
              hotel_id: hotel_id,
            })
            .then((response) => {
              if (response) {
                return resolve(message["200_SUCCESS"]);
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
              console.log(error);
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

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.chatbot_docs
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.chatbot_docs = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "CHATBOT_DOCS_NOT_FOUND"
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

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.chatbot_docs
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.chatbot_docs = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "CHATBOT_DOCS_NOT_FOUND"
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

  update(chatbot_docs_id, docs_dir, file_name) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: chatbot_docs_id })
        .then((response) => {
          models.chatbot_docs
            .update(
              {
                docs_dir: docs_dir,
                file_name: file_name,
              },
              {
                where: {
                  id: chatbot_docs_id,
                },
              }
            )
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

  delete(chatbot_docs_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: chatbot_docs_id })
        .then((response) => {
          models.chatbot_docs
            .destroy({
              where: {
                id: chatbot_docs_id,
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
}

module.exports = {
  Chatbot_Docs,
};
