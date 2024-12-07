const models = require("../../models");
const message = require("../../config/message");

class Moonlight_Guest {
  constructor() {}

  create(hotel_id, name, num_guest, room_id, process, idList) {
    return new Promise((resolve, reject) => {
      models.moonlight_guest
        .create({
          hotel_id: hotel_id,
          name: name,
          num_guest: num_guest,
          room_id: room_id,
          process: process,
          id_list: idList,
        })
        .then((response) => {
          if (response) {
            return resolve({
              status: message["200_SUCCESS"].status,
              moonlight_guest: response,
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
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.moonlight_guest
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.guests = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "GUEST_NOT_FOUND")
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.moonlight_guest
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.moonlight_guest = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "GUEST_NOT_FOUND")
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  updateProcess(moonlight_guest_id, process) {
    return new Promise((resolve, reject) => {
      models.moonlight_guest
        .update(
          {
            process: process,
          },
          { where: { id: moonlight_guest_id } }
        )
        .then((response) => {
          if (response) {
            models.moonlight_guest
              .findOne({ where: { id: moonlight_guest_id } })
              .then((response) => {
                return resolve({
                  status: message["200_SUCCESS"].status,
                  message: "PROCESS_UPDATE_SUCCESS",
                  moonlight_guest: response,
                });
              });
          } else {
            return reject({
              status: message["404_NOT_FOUND"].status,
              ...message.issueMessage(
                message["404_NOT_FOUND"],
                "MOONLIGHT_GUEST_NOT_FOUND"
              ),
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return reject({
            status: message["500_SERVER_INTERNAL_ERROR"].status,
            ...message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR",
              error
            ),
          });
        });
    });
  }

  updateNameandNum(moonlight_guest_id, name, num_guest) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: moonlight_guest_id })
        .then((response) => {
          models.moonlight_guest
            .update(
              {
                name: name,
                num_guest: num_guest,
              },
              { where: { id: moonlight_guest_id } }
            )
            .then((response) => {
              if (response) {
                models.moonlight_guest
                  .findOne({ where: { id: moonlight_guest_id } })
                  .then((response) => {
                    return resolve({
                      status: message["200_SUCCESS"].status,
                      message: "GUEST_NAME_AND_NUM_UPDATE_SUCCESS",
                      moonlight_guest: response,
                    });
                  });
              } else {
                return reject({
                  status: message["404_NOT_FOUND"].status,
                  ...message.issueMessage(
                    message["404_NOT_FOUND"],
                    "MOONLIGHT_GUEST_NOT_FOUND"
                  ),
                });
              }
            })
            .catch((error) => {
              console.log(error);
              return reject({
                status: message["500_SERVER_INTERNAL_ERROR"].status,
                ...message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR",
                  error
                ),
              });
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  delete(moonlight_guest_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: moonlight_guest_id }).then((response) => {
        models.moonlight_guest
          .destroy({
            where: {
              id: moonlight_guest_id,
            },
          })
          .then((response) => {
            return resolve(message["200_SUCCESS"]);
          })
          .catch((error) => {
            console.log(error);
            return reject(error);
          });
      });
    }).catch((error) => {
      return reject(error);
    });
  }

  deletebyhotel(hotel_id) {
    return new Promise((resolve, reject) => {
      models.moonlight_guest
        .destroy({
          where: {
            hotel_id: hotel_id,
          },
        })
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }
}

module.exports = {
  Moonlight_Guest,
};
