const models = require("../../models");
const message = require("../../config/message");
const { Hotel } = require("./hotel");
const { Op } = require("sequelize");

class Ai_Request extends Hotel {
  constructor() {
    super();
  }

  addcount(count, hotel_id, year, month) {
    return new Promise((resolve, reject) => {
      super.readOne(hotel_id).then((response) => {
        models.ai_request
          .findOne({
            where: {
              hotel_id: hotel_id,
              createdAt: {
                [Op.gte]: new Date(year, month - 1, 1),
                [Op.lt]: new Date(year, month, 1),
              },
            },
          })
          .then((existingRecord) => {
            if (existingRecord) {
              // 기존 레코드가 존재하면 count를 업데이트
              existingRecord
                .update({ count: existingRecord.count + count })
                .then((updatedRecord) => {
                  var obj = Object.assign({}, message["200_SUCCESS"]);
                  obj.ai_request = updatedRecord;
                  return resolve(obj);
                });
            } else {
              // 존재하지 않으면 새로운 레코드를 생성
              models.ai_request
                .create({
                  count: count,
                  hotel_id: hotel_id,
                })
                .then((newRecord) => {
                  var obj = Object.assign({}, message["200_SUCCESS"]);
                  obj.ai_request = newRecord;
                  return resolve(obj);
                });
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
    });
  }

  getcount(hotel_id, year, month) {
    return new Promise((resolve, reject) => {
      models.ai_request
        .findOne({
          where: {
            hotel_id: hotel_id,
            createdAt: {
              [Op.gte]: new Date(year, month - 1, 1),
              [Op.lt]: new Date(year, month, 1),
            },
          },
          attributes: ["id", "hotel_id", "count"],
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.ai_request = response.dataValues;
            return resolve(obj);
          } else {
            // 레코드가 존재하지 않는 경우 count를 0으로 반환
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.ai_request = { hotel_id: hotel_id, count: 0 };
            return resolve(obj);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(
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
  Ai_Request,
};
