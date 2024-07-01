const message = require("../../config/message");
// const { Hotel } = require("./hotel");
const { Service_Category } = require("./service_category");
const models = require("../../models");

class Service extends Service_Category {
  constructor() {
    super();
  }

  create(name, eng_name, content, purpose, description, service_category_id) {
    return new Promise((resolve, reject) => {
      super.readOne(service_category_id).then((response) =>
        models.service
          .create({
            name: name,
            eng_name: eng_name,
            content: content,
            purpose: purpose,
            description: description,
            service_category_id: service_category_id,
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
          })
      );
    }).catch((error) => {
      return reject(error);
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.service
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.service = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "SERVICE_NOT_FOUND"
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

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.service
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.service = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "SERVICE_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  update(service_id, content, purpose, description, service_category_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: service_id })
        .then((response) => {
          models.service.update(
            {
              content: content,
              purpose: purpose,
              description: description,
              service_category_id: service_category_id,
            },
            {
              where: { id: service_id },
            }
          );
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
          return reject(error);
        });
    });
  }

  delete(service_id) {
    return new Promise((resolve, reject) => {
      models.service
        .destroy({
          where: {
            id: service_id,
          },
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
          return reject(error);
        });
    });
  }
}

module.exports = { Service };
