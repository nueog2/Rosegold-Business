const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("./hotel");

class Requirement_Category extends Hotel {
  constructor() {
    super();
  }

  create(name, hotel_id) {
    return new Promise((resolve, reject) => {
      super
        .readOne(hotel_id)
        .then((response) => {
          models.requirement_category
            .create({
              name: name,
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
      models.requirement_category
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.requirement_category = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_CATEGORY_NOT_FOUND"
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
      models.requirement_category
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.requirement_category = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_CATEGORY_NOT_FOUND"
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

  update(requirement_category_id, name) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: requirement_category_id })
        .then((response) => {
          models.requirement_category
            .update(
              {
                name: name,
              },
              {
                where: {
                  id: requirement_category_id,
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

  delete(requirement_category_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: requirement_category_id })
        .then((response) => {
          models.requirement_category
            .destroy({
              where: {
                id: requirement_category_id,
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
  Requirement_Category,
};
