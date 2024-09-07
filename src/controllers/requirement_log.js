const Requirement_Log = require("../models/hotel").Requirement_Log;
const message = require("../../config/message");
const requirement = require("../../models/schema/requirement");
const { Worker } = require("../models/hotel");
const Room = require("../models/hotel").Room;
const ChattingLog = require("../models/chatting_log").ChattingLog;
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

    // 모든 호텔의 type별 총 갯수 계산
    const totalResult = await models.requirement_log.findAll({
      attributes: [
        "type",
        [Sequelize.fn("COUNT", Sequelize.col("type")), "count"],
      ],
      group: ["type"],
    });

    // 모든 호텔의 총 요청 수 계산
    const totalRequestCount = totalResult.reduce((acc, log) => {
      return acc + parseInt(log.dataValues.count, 10);
    }, 0);

    // 호텔별로 총 갯수를 계산
    const totalCountByHotel = result.reduce((acc, log) => {
      const hotelId = log.dataValues.hotel_id;
      const count = parseInt(log.dataValues.count, 10);
      if (!acc[hotelId]) acc[hotelId] = 0;
      acc[hotelId] += count;
      return acc;
    }, {});

    // 모든 호텔의 type별 총 갯수와 비율 계산
    const totalTypeCount = totalResult.map((log) => {
      const type = log.dataValues.type;
      const count = log.dataValues.count;
      const percentage = ((count / totalRequestCount) * 100).toFixed(2) + "%";

      return {
        type: type,
        total_count: count,
        percentage: percentage, // 전체 요청 중 비율
      };
    });

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

    return {
      statistics,
      totalTypeCount, // 모든 호텔의 type별 총 갯수 추가
    };
  } catch (error) {
    console.error(
      "Error fetching requirement log totaltypecount, statistics:",
      error
    );
    throw error;
  }
}

async function getRequirementLogStatisticsTotal() {
  try {
    const { Sequelize } = require("../../models/index.js");

    // 모든 호텔의 type별 총 갯수 계산
    const totalResult = await models.requirement_log.findAll({
      attributes: [
        "type",
        [Sequelize.fn("COUNT", Sequelize.col("type")), "count"],
      ],
      group: ["type"],
    });

    // 모든 호텔의 총 요청 수 계산
    const totalRequestCount = totalResult.reduce((acc, log) => {
      return acc + parseInt(log.dataValues.count, 10);
    }, 0);

    // 모든 호텔의 type별 총 갯수와 비율 계산
    const totalTypeCount = totalResult.map((log) => {
      const type = log.dataValues.type;
      const count = log.dataValues.count;
      const percentage = ((count / totalRequestCount) * 100).toFixed(2) + "%";

      return {
        type: type,
        total_count: count,
        percentage: percentage,
      };
    });

    return {
      totalTypeCount,
    };
  } catch (error) {
    console.error("Error fetching requirement log total type count:", error);
    throw error;
  }
}

function getRequirementLogStatisticsTotalHandler(req, res) {
  // const hotelId = req.query.hotel_id;

  getRequirementLogStatisticsTotal()
    .then((statistics) => {
      res.status(200).json(statistics);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
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

// 통계 계산 함수
async function getRequirementLogByReadCount(process_department_id) {
  try {
    const whereClause = {
      process_department_id: process_department_id,
      readcount: 0, // 안읽은 것만 조회
    };

    const { Sequelize } = require("../../models/index.js");
    const result = await models.requirement_log.findAll({
      attributes: [
        "process_department_id",
        [Sequelize.fn("COUNT", Sequelize.col("readcount")), "count"],
      ],
      where: whereClause,
      group: ["process_department_id"],
    });

    // 결과를 반환
    const statistics = result.map((log) => {
      return {
        process_department_id: log.dataValues.process_department_id,
        count: log.dataValues.count,
      };
    });

    return statistics;
  } catch (error) {
    console.error("Error fetching requirement log statistics:", error);
    throw error;
  }
}

// GET 요청 핸들러
function getRequirementLogStatisticsforReadCount(req, res) {
  const department_id = req.query.department_id;

  getRequirementLogByReadCount(department_id)
    .then((statistics) => {
      res.status(200).json(statistics);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
}

//active-standby , tomcat

// 새로운 고객 요청사항 페이지용 api
// 남은 해야 할 것 -> pagination 처리!!

function getSummarizedSentencesForHotel(req, res) {
  // 호텔 내 모든 호실(room_id) 가져오기
  // const room = new Room();
  const { Sequelize } = require("../../models/index.js");

  const page = parseInt(req.query.page, 10) || 1; // 기본값은 1페이지
  const limit = parseInt(req.query.limit, 10) || 10; // 요소 갯수 및 기본값은 10으로 설정
  const offset = (page - 1) * limit; // 페이지에 따른 데이터 시작점 계산

  return (
    models.room
      .findAll({
        where: {
          hotel_id: req.query.hotel_id,
        },
        attributes: ["id", "name"],
        limit: limit,
        offset: offset,
      })
      .then((rooms) => {
        const roomSummariesPromises = rooms.map((room) =>
          getSummarizedSentenceForRoom(room.id).then((result) => ({
            room_id: room.id,
            room_name: room.name,
            requirement_log_id: result.requirement_log_id,
            summarized_sentence: result.summarized_sentence,
            createdAt: result.createdAt,
            process_department_id: result.process_department_id,
            user_id: result.user_id,
            progress: result.progress,
          }))
        );

        return Promise.all(roomSummariesPromises);
      })
      .then((summaries) => {
        // 총 방 개수를 가져와서 페이지네이션 정보를 추가해 응답
        return models.room
          .count({
            where: {
              hotel_id: req.query.hotel_id,
            },
          })
          .then((totalRooms) => {
            const totalPages = Math.ceil(totalRooms / limit); // 전체 페이지 수 계산
            res.status(200).send({
              total_Items: totalRooms, // 전체 방 개수
              total_Pages: totalPages, // 전체 페이지 수
              current_Page: page, // 현재 페이지
              summaries: summaries, // 각 호실의 요약 데이터
            });
          });
      })

      //   // console.log("Summaries:", summaries);
      //   res.status(200).send(summaries);
      // })
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
      })
  );
}

function getSummarizedSentenceForRoom(roomId) {
  const requirement_log = new Requirement_Log();
  const chatting_log = new ChattingLog();
  const { Sequelize } = require("../../models/index.js");

  return models.requirement_log
    .findOne({
      where: {
        room_id: roomId,
        progress: [0, 1], // progress가 0 또는 1
      },
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "summarized_sentence",
        "createdAt",
        "process_department_id",
        "user_id",
        "progress",
      ],
    })
    .then((latestRequirement) => {
      if (latestRequirement) {
        return {
          requirement_log_id: latestRequirement.id,
          summarized_sentence: latestRequirement.summarized_sentence,
          createdAt: latestRequirement.createdAt,
          process_department_id:
            latestRequirement.process_department_id || null,
          user_id: latestRequirement.user_id || null,
          progress: latestRequirement.progress,
        };
      } else {
        return models.chatting_log
          .findOne({
            where: {
              room_id: roomId,
              summarized_sentence: { [Sequelize.Op.ne]: null },
            },
            order: [["createdAt", "DESC"]],
            attributes: ["summarized_sentence", "createdAt"],
          })
          .then((latestChat) => {
            if (latestChat) {
              return {
                requirement_log_id: null,
                summarized_sentence: latestChat.summarized_sentence,
                createdAt: latestChat.createdAt,
                process_department_id: null,
                user_id: null,
                progress: null,
              };
            } else {
              return {
                requirement_log_id: null,
                summarized_sentence: null,
                createdAt: null,
                process_department_id: null,
                user_id: null,
                progress: null,
              };
            }
          });
      }
    })
    .catch((error) => {
      console.log(error);
      return {
        requirement_log_id: null,
        summarized_sentence: null,
        createdAt: null,
        process_department_id: null,
        user_id: null,
        progress: null,
      };
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
  getRequirementLogStatisticsTotalHandler,
  getRequirementLogStatisticsforReadCount,
  getSummarizedSentencesForHotel,
};
