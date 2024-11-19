const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("../models/hotel");
const { Worker } = require("../models/hotel");

// const admin = require("firebase-admin");

class Moonlight_Notice {
  constructor() {}

  create(content, hotel_id) {
    return new Promise((resolve, reject) => {
      const hotel = new Hotel();
      hotel.readOne(hotel_id).then((response) => {
        models.moon_notice
          .create({ content: content, hotel_id: hotel_id })
          .then((response) => {
            // console.log("\n\n\nMoonlight_notice : ", response);
            // console.log("work_notice created:", {
            //   content,
            //   department_id,
            //   hotel_id,
            //   user_id,
            // });
            return resolve({
              status: message["200_SUCCESS"].status,
              result: response,
            });
          })
          .catch((error) => {
            console.log(error);
            return reject(error);
          });
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
      models.moon_notice
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.moonlight_notices = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "MOONLIGHT_NOTICE_NOT_FOUND"
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

  delete(moon_notice_id) {
    return new Promise((resolve, reject) => {
      models.moon_notice
        .destroy({
          where: { id: moon_notice_id },
        })
        .then((response) => {
          if (response == 1) {
            return resolve(message["200_SUCCESS"]);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "MOONLIGHT_NOTICE_NOT_FOUND"
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

module.exports = {
  Moonlight_Notice,
};
