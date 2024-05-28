const models = require("../../models");
const message = require("../../config/message");
const { Requirement_Category } = require("./requirement_category");

class Requirement extends Requirement_Category {
  constructor() {
    super();
  }

  create(
    name,
    able_start_time,
    able_end_time,
    price,
    thumbnail_image_url,
    description,
    requirement_category_id
  ) {
    return new Promise((resolve, reject) => {
      console.log("Creating requirement with data:", {
        name,
        able_start_time,
        able_end_time,
        price,
        thumbnail_image_url,
        description,
        requirement_category_id,
      });

      super
        .readOne(requirement_category_id)
        .then((response) => {
          console.log("Requirement category found:", response);

          models.requirement
            .create({
              name: name,
              able_start_time: able_start_time,
              able_end_time: able_end_time,
              price: price,
              thumbnail_image_url: thumbnail_image_url,
              description: description,
              requirement_category_id: requirement_category_id,
            })
            .then((response) => {
              if (response) {
                console.log("Requirement created:", response);
                return resolve(message["200_SUCCESS"]);
              } else {
                console.log("Requirement creation failed");
                return reject(
                  message.issueMessage(
                    message["500_SERVER_INTERNAL_ERROR"],
                    "UNDEFINED_ERROR"
                  )
                );
              }
            })
            .catch((error) => {
              console.log("Error creating requirement:", error);
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          console.log("Error finding requirement category:", error);
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.requirement
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.requirements = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_NOT_FOUND"
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
      models.requirement
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.requirement = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_NOT_FOUND"
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

  update(
    requirement_id,
    name,
    able_start_time,
    able_end_time,
    price,
    thumbnail_image_url,
    description
  ) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: requirement_id })
        .then((response) => {
          models.requirement
            .update(
              {
                name: name,
                able_start_time: able_start_time,
                able_end_time: able_end_time,
                price: price,
                thumbnail_image_url: thumbnail_image_url,
                description: description,
              },
              {
                where: {
                  id: requirement_id,
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

  delete(requirement_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: requirement_id })
        .then((response) => {
          models.requirement
            .destroy({
              where: {
                id: requirement_id,
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
  Requirement,
};
