const models = require("../../models");
const message = require("../../config/message");
// const moonlight_payment = require("../../models/schema/moonlight_payment");

class Moonlight_Payment {
  constructor() {}

  create(
    hotel_id,
    apprNo,
    apprDate,
    cardNum,
    cardName,
    acquirerName,
    issuerCode,
    acquirerCode,
    merchantNumber,
    message,
    notice,
    urlList
  ) {
    return new Promise((resolve, reject) => {
      models.moonlight_payment
        .create({
          hotel_id: hotel_id,
          apprNo: apprNo,
          apprDate: apprDate,
          cardNum: cardNum,
          cardName: cardName,
          acquirerName: acquirerName,
          issuerCode: issuerCode,
          acquirerCode: acquirerCode,
          merchantNumber: merchantNumber,
          message: message,
          notice: notice,
          url_list: urlList,
        })
        .then((response) => {
          if (response) {
            return resolve({
              status: message["200_SUCCESS"]?.status || 200,
              moonlight_payment: response,
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
      models.moonlight_payment
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.moonlight_payment = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "PAYMENT_INFO_NOT_FOUND"
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
      models.moonlight_payment
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.moonlight_payment = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "PAYMENT_INFO_NOT_FOUND"
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

  delete(moonlight_payment_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: moonlight_payment_id }).then((response) => {
        models.moonlight_payment
          .destroy({
            where: {
              id: moonlight_payment_id,
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
      models.moonlight_payment
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
  Moonlight_Payment,
};
