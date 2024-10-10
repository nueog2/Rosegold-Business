const models = require("../../models");
const message = require("../../config/message");

class Work_Log {
  constructor() {}

  readOnebyUser(user_id) {
    return new Promise((resolve, reject) => {
      models.work_log
        .findOne({
          where: { user_id: user_id },
          order: [["id", "DESC"]],
          limit: 1,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.work_log = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "WORK_LOG_NOT_FOUND"
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
      models.work_log
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.work_log = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "WORK_LOG_NOT_FOUND"
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

  //제일 최신 업데이트용
  update(user_id, status, reason = null) {
    return new Promise((resolve, reject) => {
      models.work_log
        .update(
          {
            // user_id: user_id,
            status: status,
            reason: reason,
          },
          {
            where: {
              user_id: user_id,
            },
            order: [["createdAt", "DESC"]],
            limit: 1,
          }
        )
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          console.log(error);
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }
}

module.exports = { Work_Log };
