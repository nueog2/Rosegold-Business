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
      const { Sequelize } = require("../../models/index.js");

      models.requirement_log
        .findAll({
          where: {
            hotel_id: hotel_id,
            createdAt: {
              [Op.gte]: new Date(year, month - 1, 1),
              [Op.lt]: new Date(year, month, 1),
            },
            type: {
              [Op.in]: ["부가서비스", "메뉴판 요청사항"], //부가서비스와 메뉴판 요청사항만 필터링
            },
          },
          attributes: [
            "type",
            [Sequelize.fn("COUNT", Sequelize.col("type")), "count"],
          ],
          group: ["type"],
        })
        .then((logs) => {
          // 부가서비스와 메뉴판 요청사항 로그의 총 갯수
          const additionalCount =
            logs.length > 0 ? parseInt(logs[0].dataValues.count, 10) : 0;

          console.log("additionalCount: ", additionalCount);

          return models.ai_request
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
              return models.ai_request
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
                  const count = response
                    ? parseInt(response.dataValues.count, 10)
                    : 0;
                  const total_count = count + additionalCount; // count와 additionalCount의 합계 계산

                  const percentage =
                    total_count > 0
                      ? ((count / total_count) * 100).toFixed(2) + "%"
                      : "0%"; // 비율 계산

                  var obj = Object.assign({}, message["200_SUCCESS"]);
                  obj.ai_request = {
                    hotel_id: hotel_id,
                    count: count,
                    total_count: total_count, // 총 갯수
                    percentage: percentage, // 비율
                  };
                  return resolve(obj);
                });
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
    });
  }
}

module.exports = {
  Ai_Request,
};
