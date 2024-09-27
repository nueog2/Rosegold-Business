const models = require("../../models");
const message = require("../../config/message");

class ChattingLogGuest {
  constructor() {}

  create_Naver(hotel_id, event, user, text) {
    return new Promise((resolve, reject) => {
      const findOrCreateGuestNum = async () => {
        const existingGuest = await models.chatting_log_guest.findOne({
          where: {
            hotel_id: hotel_id,
            user: user,
          },
          order: [["guest_num", "DESC"]], // 최신의 guest_num을 가져오기 위함
        });

        if (existingGuest) {
          return existingGuest.guest_num;
        } else {
          const maxGuestNum = await models.chatting_log_guest.max("guest_num", {
            where: {
              hotel_id: hotel_id,
            },
          });

          return maxGuestNum ? maxGuestNum + 1 : 1;
        }
      };

      findOrCreateGuestNum().then((guest_num) => {
        if (event == "send") {
          //고객 -> 톡톡
          models.chatting_log_guest
            .create({
              hotel_id: hotel_id,
              user: user,
              guest_num: guest_num,
              question: text,
              platform: "naver",
            })
            .then((response) => {
              if (response) {
                return resolve({
                  // return resolve(message["200_SUCCESS"]);
                  status: message["200_SUCCESS"].status,
                  chatting_log_guest: response,
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
        } else {
          // 챗봇 -> 톡톡
          // evnet : echo case
          models.chatting_log_guest
            .create({
              hotel_id: hotel_id,
              user: user,
              answer: text,
              guest_num: guest_num,
              platform: "naver",
            })
            .then((response) => {
              if (response) {
                return resolve({
                  // return resolve(message["200_SUCCESS"]);
                  status: message["200_SUCCESS"].status,
                  chatting_log_guest: response,
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
              return reject({
                status: error.status,
                error: error,
              });
            });
        }
      });
    });
  }

  find_Guest() {
    return new Promise((resolve, reject) => {
      models.chatting_log_guest
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

  send_Naver(hotel_id, user, text) {
    return new Promise((resolve, reject) => {
      const url = `https://gw.talk.naver.com/chatbot/v1/event?hotel_id=${hotel_id}`;

      const data = {
        event: "echo",
        user: user,
        textContent: {
          text: text,
        },
      };

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "XNbfuAgcRbiLiYMYwGhl",
      };

      axios
        .post(url, data, { headers: headers })
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error.response ? error.response.data : error.message);
          reject(error.response ? error.response.data : error.message);
        });
    });
  }

  create_Kakao(hotel_id, event, user, text) {
    return new Promise((resolve, reject) => {
      const findOrCreateGuestNum = async () => {
        const existingGuest = await models.chatting_log_guest.findOne({
          where: {
            hotel_id: hotel_id,
            user: user,
          },
          order: [["guest_num", "DESC"]],
        });

        if (existingGuest) {
          return existingGuest.guest_num;
        } else {
          const maxGuestNum = await models.chatting_log_guest.max("guest_num", {
            where: {
              hotel_id: hotel_id,
            },
          });

          return maxGuestNum ? maxGuestNum + 1 : 1;
        }
      };

      findOrCreateGestNum().then((guest_num) => {
        if (event == "send") {
          models.chatting_log_guest
            .create({
              hotel_id: hotel_id,
              user: user,
              guest_num: guest_num,
              question: text,
              platform: "kakao",
            })
            .then((response) => {
              if (response) {
                return resolve({
                  status: message["200_SUCCESS"].status,
                  chatting_log_guest: response,
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
              console.log(error);
              return reject(error);
            });
        } else {
          models.chatting_log_guest
            .create({
              hotel_id: hotel_id,
              user: user,
              answer: text,
              guest_num: guest_num,
              platform: "kakao",
            })
            .then((response) => {
              if (response) {
                return resolve({
                  status: message["200_SUCCESS"].status,
                  chatting_log_guest: response,
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
              return reject({
                status: error.status,
                error: error,
              });
            });
        }
      });
    });
  }

  send_Kakao(hotel_id, user, text) {
    return new Promise((resolve, reject) => {
      //   const url = `https://gw.talk.naver.com/chatbot/v1/event?hotel_id=${hotel_id}`;

      const data = {
        event: "echo",
        user: user,
        textContent: {
          text: text,
        },
      };

      const headers = {
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: "",
      };

      axios
        .post(url, data, { headers: headers })
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error.response ? error.response.data : error.message);
          reject(error.response ? error.response.data : error.message);
        });
    });
  }

  create_Page(hotel_id, event, user, text) {
    return new Promise((resolve, reject) => {
      const findOrCreateGuestNum = async () => {
        const existingGuest = await models.chatting_log_guest.findOne({
          where: {
            hotel_id: hotel_id,
            user: user,
          },
          order: [["guest_num", "DESC"]], // 최신의 guest_num을 가져오기 위함
        });

        if (existingGuest) {
          return existingGuest.guest_num;
        } else {
          const maxGuestNum = await models.chatting_log_guest.max("guest_num", {
            where: {
              hotel_id: hotel_id,
            },
          });

          return maxGuestNum ? maxGuestNum + 1 : 1;
        }
      };

      findOrCreateGuestNum().then((guest_num) => {
        if (event == "send") {
          //고객 -> 챗봇
          models.chatting_log_guest
            .create({
              hotel_id: hotel_id,
              user: user,
              guest_num: guest_num,
              question: text,
              platform: "homepage",
            })
            .then((response) => {
              if (response) {
                return resolve({
                  // return resolve(message["200_SUCCESS"]);
                  status: message["200_SUCCESS"].status,
                  chatting_log_guest: response,
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
        } else {
          // 챗봇 -> 고객

          models.chatting_log_guest
            .create({
              hotel_id: hotel_id,
              user: user,
              answer: text,
              guest_num: guest_num,
              platform: "homepage",
            })
            .then((response) => {
              if (response) {
                return resolve({
                  // return resolve(message["200_SUCCESS"]);
                  status: message["200_SUCCESS"].status,
                  chatting_log_guest: response,
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
              return reject({
                status: error.status,
                error: error,
              });
            });
        }
      });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.chatting_log_guest
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.chatting_log_guests = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "CHAT_LOG_NOT_FOUND"
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
  ChattingLogGuest,
};

//인증키 : XNbfuAgcRbiLiYMYwGhl
