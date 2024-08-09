const Requirement_Log = require("../models/hotel").Requirement_Log;
const message = require("../../config/message");
const requirement = require("../../models/schema/requirement");
const { Worker } = require("../models/hotel");
const Room = require("../models/hotel").Room;
const Sequelize = require("sequelize");
// import { Sequelize } from "sequelize";

function createRequirementLog(req, res) {
  if (
    req.body.type == null ||
    req.body.room_id == null ||
    req.body.requirement_article == null ||
    req.body.response_article == null ||
    req.body.hotel_id == null ||
    req.body.process_department_id == null ||
    req.body.requirement_id == null ||
    req.body.summarized_sentence == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement_log = new Requirement_Log();
  requirement_log
    .create(
      req.body.type,
      req.body.room_id,
      req.body.requirement_article,
      req.body.response_article,
      req.body.hotel_id,
      req.body.process_department_id,
      req.body.requirement_id,
      req.body.summarized_sentence,
      req.body.user_id
    )
    .then((response) => {
      const worker = new Worker();
      worker
        .readManyByDepartment2(req.body.process_department_id)
        .then((departmentWorkers) => {
          console.log(departmentWorkers);
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          if (!error.status)
            return res
              .status(message["500_SERVER_INTERNAL_ERROR"].status)
              .send(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
          else return res.status(error.status).send(error);
        });
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

// function createRequirementLogbyMenu(req, res) {
//   if (
//     req.body.room_id == null ||
//     req.body.department_name == null ||
//     req.body.menu == null ||
//     req.body.price == null ||
//     req.body.num == null
//   ) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   const requirement_log = new Requirement_Log();
//   requirement_log
//     .createbymenu(
//       req.body.room_id,
//       req.body.department_name,
//       req.body.menu,
//       req.body.price,
//       req.body.num
//     )
//     .then((response) => {
//       return res.status(response.status).send(response);
//     })
//     .catch((error) => {
//       console.log(error);
//       if (!error.status)
//         return res
//           .status(message["500_SERVER_INTERNAL_ERROR"].status)
//           .send(
//             message.issueMessage(
//               message["500_SERVER_INTERNAL_ERROR"],
//               "UNDEFINED_ERROR"
//             )
//           );
//       else return res.status(error.status).send(error);
//     });
// }

function createRequirementLogbyMenu(req, res) {
  const { results } = req.body;

  // room_id와 results 배열이 존재하는지 확인
  if (!Array.isArray(results)) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const allprice = results.reduce((acc, requirement) => {
    const { price, num } = requirement;
    return acc + price * num;
  }, 0);

  // results 배열의 각 항목을 순회하면서 Requirement_Log 인스턴스를 생성, 처리
  const promises = results.map((requirement) => {
    const { room_id, department_name, menu, price, num } = requirement;

    // 각 항목의 필수 값 존재 여부 확인
    if (!room_id || !department_name || !menu || price === null || !num) {
      return Promise.reject({
        status: message["400_BAD_REQUEST"].status,
        message: message.issueMessage(
          message["400_BAD_REQUEST"],
          "SEND_ALL_PARAMETERS"
        ),
      });
    }

    const requirement_log = new Requirement_Log();
    const room = new Room();
    // room.readOne({ name : room_name , hotel_id : hotel_id }).then((response) => {
    // const room_id = response.id;

    return requirement_log
      .createbymenu(room_id, department_name, menu, price, num)
      .then((response) => {
        const identifier = response.requirement_log.id;
        new Requirement_Log()
          .updateidentifier(identifier, response.requirement_log.id)
          .then(() => response);
        return response;
        // room
        //   .addService(room_id, results.length)
        //   // .addService(room_id, results.length)
        //   // .then(() => room.addPrice(room_id, price))
        //   .then(() => response)
      });
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        const room = new Room();
        return room
          .addPrice(results[0].room_id, allprice)
          .then(() => room.addService(results[0].room_id, results.length))
          .then(() => res.status(200).send(responses));
      } else {
        // 응답 중 하나라도 실패한 경우 첫 번째 실패 응답을 반환
        const errorResponse = responses.find(
          (response) => response.status !== 200
        );
        return res.status(errorResponse.status).send(errorResponse);
      }
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function createRequirementLogAdditionalService(req, res) {
  if (
    req.body.room_id == null ||
    req.body.summarized_sentence == null ||
    req.body.price == null ||
    req.body.pmsign == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement_log = new Requirement_Log();
  requirement_log
    .createAdditionalService(
      req.body.room_id,
      req.body.summarized_sentence,
      req.body.price,
      req.body.pmsign
    )
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getRequirementLogMany(req, res) {
  const requirement_log = new Requirement_Log();
  requirement_log
    .readMany(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getRequirementLogManyByDate(req, res) {
  const requirement_log = new Requirement_Log();
  requirement_log
    .readManyByDate(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getRequirementLogManyByRoom(req, res) {
  const requirement_log = new Requirement_Log();
  requirement_log
    .readManyByRoom(req.query)
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getRequirementLogManyDetail(req, res) {
  const requirement_log = new Requirement_Log();
  requirement_log
    .readManyMenuPriceNum(req.query)
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function getRequirementLogOne(req, res) {
  if (req.query.requirement_log_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .readOne({ id: req.query.requirement_log_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function updateRequirementLog(req, res) {
  if (req.body.requirement_log_id == null || req.body.progress == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement_log = new Requirement_Log();
  requirement_log
    .update(req.body.requirement_log_id, req.body.progress)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function updateRequirementLogDepartment(req, res) {
  if (
    req.body.requirement_log_id == null ||
    req.body.process_department_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .updateDepartment(
      req.body.requirement_log_id,
      req.body.process_department_id
    )
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function updateRequirementLogWorker(req, res) {
  if (req.body.requirement_log_id == null || req.body.user_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .updateWorker(req.body.requirement_log_id, req.body.user_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function updateRequirementLogRead(req, res) {
  if (req.query.requirement_log_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .updateReadCount(req.query.requirement_log_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function deleteRequirementLog(req, res) {
  if (req.query.requirement_log_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .delete(req.query.requirement_log_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function deleteRequirementLogByHotel(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .deletebyHotelID(req.query.hotel_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      else return res.status(error.status).send(error);
    });
}

const models = require("../../models");

// 통계 계산 함수
async function getRequirementLogStatistics(hotelId) {
  try {
    const whereClause = hotelId ? { hotel_id: hotelId } : {};
    const { Sequelize } = require("../../models/index.js");
    const result = await models.requirement_log.findAll({
      attributes: [
        "type",
        "hotel_id",
        [Sequelize.fn("COUNT", Sequelize.col("type")), "count"],
      ],
      where: whereClause,
      group: ["hotel_id", "type"],
    });

    // 호텔별로 총 갯수를 계산
    const totalCountByHotel = result.reduce((acc, log) => {
      const hotelId = log.dataValues.hotel_id;
      const count = parseInt(log.dataValues.count, 10);
      if (!acc[hotelId]) acc[hotelId] = 0;
      acc[hotelId] += count;
      return acc;
    }, {});

    // 각 호텔 및 type별 갯수와 퍼센트를 계산
    const statistics = result.map((log) => {
      const hotelId = log.dataValues.hotel_id;
      const count = log.dataValues.count;
      const totalCount = totalCountByHotel[hotelId];
      return {
        hotel_id: hotelId,
        type: log.dataValues.type,
        count: count,
        percentage: ((count / totalCount) * 100).toFixed(2) + "%",
      };
    });

    return statistics;
  } catch (error) {
    console.error("Error fetching requirement log statistics:", error);
    throw error;
  }
}

// GET 요청 핸들러
function getRequirementLogStatisticsHandler(req, res) {
  const hotelId = req.query.hotel_id;

  getRequirementLogStatistics(hotelId)
    .then((statistics) => {
      res.status(200).json(statistics);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

module.exports = {
  createRequirementLog,
  createRequirementLogbyMenu,
  createRequirementLogAdditionalService,
  getRequirementLogMany,
  getRequirementLogManyByDate,
  getRequirementLogManyByRoom,
  getRequirementLogManyDetail,
  getRequirementLogOne,
  updateRequirementLog,
  updateRequirementLogDepartment,
  updateRequirementLogWorker,
  updateRequirementLogRead,
  deleteRequirementLog,
  deleteRequirementLogByHotel,
  getRequirementLogStatisticsHandler,
};
