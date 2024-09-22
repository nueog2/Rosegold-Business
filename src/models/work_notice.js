const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("../models/hotel");

class Work_Notice extends Hotel {
  constructor() {
    super();
  }

  create(content, department_id, hotel_id, user_id) {
    return new Promise((resolve, reject) => {
      super
        .readOne(hotel_id)
        .then((response) => {
          models.work_notice
            .create({ content, department_id, hotel_id, user_id })
            .then((response) => {
              console.log("work_notice created:", {
                content,
                department_id,
                hotel_id,
                user_id,
              });
              return resolve(message["200_SUCCESS"]);
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
          console.log(error);
          return reject(
            message.issueMessage(message["404_NOT_FOUND"], "HOTEL_NOT_FOUND")
          );
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.work_notice
        .findAll({
          where: condition,
          include: [
            {
              model: models.user,
              attributes: ["name"],
              // as: "room",
            },
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.work_notices = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "WORK_NOTICE_NOT_FOUND"
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

  delete(work_notice_id) {
    return new Promise((resolve, reject) => {
      models.work_notice
        .destroy({
          where: { id: work_notice_id },
        })
        .then((response) => {
          if (response == 1) {
            return resolve(message["200_SUCCESS"]);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "WORK_NOTICE_NOT_FOUND"
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
  Work_Notice,
};
