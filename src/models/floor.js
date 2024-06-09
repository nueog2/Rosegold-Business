const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("./hotel");

class Floor extends Hotel {
  constructor() {
    super();
  }

  create(hotel_id, floor_number) {
    return new Promise((resolve, reject) => {
      super.readOne(hotel_id).then((response) => {
        models.floor
          .create({
            hotel_id: hotel_id,
            floor_number: floor_number,
          })
          .then((response) => {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.floor = response;
            return resolve(obj);
          })
          .catch((error) => {
            console.log(error);
            return reject(
              error,
              message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
            );
          });
      });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.floor
        .findAll({
          where: condition,
          attributes: ["id", "hotel_id", "floor_number"],
        })
        .then((response) => {
          if (response.length == 0) {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "FLOOR_NOT_FOUND")
            );
          }
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.floors = response;
          return resolve(obj);
        })
        .catch((error) => {
          console.log(error);
          return reject(
            messsage.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.floor
        .findOne({
          where: condition,
          attributes: ["id", "hotel_id", "floor_number"],
        })
        .then((response) => {
          if (response == null) {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "FLOOR_NOT_FOUND")
            );
          }
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.floor = response;
          return resolve(obj);
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

  delete(floor_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: floor_id })
        .then((response) => {
          models.floor
            .destory({
              where: { id: floor_id },
            })
            .then((response) => {
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
          return reject(error);
        });
    });
  }
}

module.exports = { Floor };
