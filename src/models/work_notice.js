const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("../models/hotel");
const { Worker } = require("../models/hotel");

const admin = require("firebase-admin");

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
              console.log("\n\n\nWork_notice : ", response);
              var notice_id = response.dataValues.id;

              console.log("work_notice created:", {
                content,
                department_id,
                hotel_id,
                user_id,
              });

              var worker = new Worker();

              worker
                .readOne({ id: user_id })
                .then((response) => {
                  console.log("\n\n\n Worker_readOne :", response);
                  var workerRole = response.worker.dataValues.role_name;
                  var workerName = response.worker.dataValues.name;

                  worker.readManyByDepartment(department_id).then((workers) => {
                    console.log("\n\n\nreadManybyDepworkers2 : ", workers);
                    var sendTargetFCMTokens = [];

                    for (var i = 0; i < workers["workers"].length; i++) {
                      if (workers["workers"][i].work_logs.length > 0) {
                        if (workers["workers"][i].fcm_token.length > 0) {
                          sendTargetFCMTokens = sendTargetFCMTokens.concat(
                            workers["workers"][i].fcm_token
                          );
                        }
                      }
                    }

                    let notificationPromises = [];

                    if (sendTargetFCMTokens.length > 0) {
                      console.log("FCMTOKENS!!!! : ", sendTargetFCMTokens);
                      let _message = {
                        notification: {
                          title: "Notice",
                          body: "직원 전달사항이 있습니다 : " + content,
                        },
                        data: {
                          title: "Notice",
                          body:
                            "직원 전달사항 : " +
                            content +
                            "\n 직책 : " +
                            workerRole +
                            "\n 발송인 : " +
                            workerName +
                            "\n 전달사항 고유식별자 ID : " +
                            notice_id,
                        },
                        tokens: sendTargetFCMTokens,
                        android: {
                          priority: "high",
                        },
                        apns: {
                          payload: {
                            aps: {
                              contentAvailable: true,
                              sound: "default",
                            },
                          },
                        },
                      };
                      notificationPromises.push(
                        admin.messaging().sendEachForMulticast(_message)
                      );
                    }

                    Promise.all(notificationPromises)
                      .then((responses) => {
                        console.log(
                          "\n\nAPP MESSAGE SEND SUCCESS :",
                          responses
                        );
                        return resolve({
                          status: message["200_SUCCESS"].status,
                          // requirement_log: reqresponse,
                          result: responses,
                        });
                      })
                      .catch((err) => {
                        console.log("\n\nERROR SENDING MESSAGE!!! : ", err);
                        return resolve({
                          status: message["200_SUCCESS"].status,
                          // requirement_log: reqresponse,
                          result: err,
                        });
                      });
                  });
                })
                .catch((error) => {
                  console.log(error);
                  return resolve({
                    status: message["200_SUCCESS"].status,
                    // requirement_log: reqresponse,
                    result: error,
                  });
                });
            })
            .catch((error) => {
              console.log(error);
              if (
                error.status &&
                error.status == message["404_NOT_FOUND"].status
              ) {
                return resolve({
                  status: message["200_SUCCESS"].status,
                  // requirement_log: reqresponse,
                  result: error,
                });
              } else {
                return reject(error);
              }
            });
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
    }).catch((error) => {
      console.log(error);
      return reject(
        message.issueMessage(message["404_NOT_FOUND"], "HOTEL_NOT_FOUND")
      );
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
