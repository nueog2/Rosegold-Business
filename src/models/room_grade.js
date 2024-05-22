const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("./hotel");
//

class Room_Grade extends Hotel {
  constructor() {
    super();
  }

  create(hotel_id, name, max_occupancy, price_multiplier) {
    return new Promise((resolve, reject) => {
      models.room_grade
        .create({
          hotel_id: hotel_id,
          name: name,
          max_occupancy: max_occupancy,
          price_multiplier: price_multiplier,
        })
        .then((response) => {
          resolve(response, message["200_SUCCESS"]);
        })
        .catch((error) => {
          console.log(errpr);
          return reject(
            error,
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.room_grade
        .findAll({
          where: condition,
          attributes: [
            "id",
            "hotel_id",
            "name",
            "max_occupancy",
            "price_multiplier",
          ],
        })
        .then((response) => {
          if (response.length == 0) {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "ROOM_GRADE_NOT_FOUND"
              )
            );
          } else {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.room_grades = response;
            return resolve(obj);
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(
            messsage.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR",
              error
            )
          );
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.room_grade
        .findOne({
          where: condition,
          attributes: [
            "id",
            "hotel_id",
            "name",
            "max_occupancy",
            "price_multiplier",
          ],
        })
        .then((response) => {
          if (response == null) {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "ROOM_GRADE_NOT_FOUND"
              )
            );
          } else {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.room_grade = response;
            return resolve(obj);
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR",
              error
            )
          );
        });
    });
  }

  update(room_grade_id, name, max_occupancy, price_multiplier) {
    return new Promise((resolve, reject) => {
      models.room_grade
        .update(
          {
            name: name,
            max_occupancy: max_occupancy,
            price_multiplier: price_multiplier,
          },
          { where: { id: room_grade_id } }
        )
        .then((response) => {
          if (response == 0) {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "ROOM_GRADE_NOT_FOUND"
              )
            );
          } else {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.room_grade = response;
            return resolve(obj);
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR",
              error
            )
          );
        });
    });
  }

  delete(room_grade_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: room_grade_id })
        .then((response) => {
          models.room_grade
            .destroy({
              where: { id: room_grade_id },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              console.log(error);
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR",
                  error
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

module.exports = { Room_Grade };
