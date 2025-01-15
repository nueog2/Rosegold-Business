const jwt = require("../modules/jwt");
const message = require("../../config/message");
const { Room, Message } = require("../models/hotel");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Role_Assign_Log = require("../models/hotel").Role_Assign_Log;
const Requirement_Log = require("../models/hotel").Requirement_Log;
const Chatting_Log = require("../models/chatting_log").ChattingLog;
const Work_Log = require("../models/work_log").Work_Log;

const nodemailer = require("nodemailer");

const express = require("express");
const cookieParser = require("cookie-parser");
const { sequelize, Sequelize } = require("../../models");
const { token } = require("morgan");
const app = express();

const admin = require("firebase-admin");

let serAccount = require("../../config/firebase-key.json");
const { orderBy } = require("lodash");

// 이미 초기화된 앱이 있는지 확인
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serAccount),
  });
}

app.use(express.json());
app.use(cookieParser());

function createHotel(req, res) {
  if (
    req.body.name == null ||
    req.body.contact_number == null ||
    req.body.address_sido == null ||
    req.body.address_sigungu == null ||
    req.body.address_other == null ||
    req.body.checkin_date == null ||
    req.body.checkout_date == null ||
    req.body.roomservice == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const hotel = new Hotel();
  hotel
    .create(
      req.body.name,
      req.body.contact_number,
      req.body.address_sido,
      req.body.address_sigungu,
      req.body.address_other,
      req.body.checkin_date,
      req.body.checkout_date,
      req.body.roomservice
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

function getHotelMany(req, res) {
  const hotel = new Hotel();
  hotel
    .readMany({})
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

function getHotelOne(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const hotel = new Hotel();
  hotel
    .readOne({ id: req.query.hotel_id })
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

function updateHotel(req, res) {
  if (
    req.body.hotel_id == null ||
    req.body.name == null ||
    req.body.contact_number == null ||
    req.body.address_sido == null ||
    req.body.address_sigungu == null ||
    req.body.address_other == null ||
    req.body.checkin_date == null ||
    req.body.checkout_date == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const hotel = new Hotel();
  hotel
    .update(
      req.body.hotel_id,
      req.body.name,
      req.body.contact_number,
      req.body.address_sido,
      req.body.address_sigungu,
      req.body.address_other,
      req.body.checkin_date,
      req.body.checkout_date
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

function updateProcessHotel(req, res) {
  if (req.body.hotel_id == null || req.body.process == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const hotel = new Hotel();
  hotel
    .updateProcess(req.body.hotel_id, req.body.process)
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

function deleteHotel(req, res) {
  if (req.body.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const hotel = new Hotel();
  hotel
    .delete(req.body.hotel_id)
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

function createDepartment(req, res) {
  const { dep_array } = req.body;

  if (!Array.isArray(dep_array) || dep_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = dep_array.map((deps) => {
    const { name, token_name, hotel_id, business_hour } = deps;

    if (name == null || token_name == null || hotel_id == null) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const department = new Department();
    department.create(name, token_name, hotel_id, business_hour);
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
      } else {
        // 응답 중 하나라도 실패한 경우 첫 번째 실패 응답을 반환
        const errorResponse = responses.find(
          (response) => response.status !== 200
        );
        console.log(errorResponse);
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

function getDepartmentMany(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const department = new Department();
  const hotel = new Hotel();

  hotel
    .readOne({ id: req.query.hotel_id })
    .then((response) => {
      department
        .readMany({ hotel_id: req.query.hotel_id })
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

function getDepartmentOne(req, res) {
  if (req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const department = new Department();
  department
    .readOne({ id: req.query.department_id })
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

function getDepartmentBusinessHour(req, res) {
  const department = new Department();
  department
    .readBusinessHourMany({ hotel_id: req.query.hotel_id })
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

// 배열로 입력받게끔 수정
function updateDepartment(req, res) {
  const { dep_array } = req.body;

  if (!Array.isArray(dep_array) || dep_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = dep_array.map((deps) => {
    const { department_id, name, token_name } = deps;

    if (department_id == null || name == null || token_name == null) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const department = new Department();
    department.update(department_id, name, token_name);
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
      } else {
        // 응답 중 하나라도 실패한 경우 첫 번째 실패 응답을 반환
        const errorResponse = responses.find(
          (response) => response.status !== 200
        );
        console.log(errorResponse);
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

function deleteDepartment(req, res) {
  if (req.body.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const department = new Department();
  department
    .delete(req.body.department_id)
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

function createRole(req, res) {
  if (req.body.name == null || req.body.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const role = new Role();
  role
    .create(req.body.name, req.body.department_id)
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

function getRoleMany(req, res) {
  const role = new Role();
  role
    .readMany({})
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

function getRoleManyByDepartmentID(req, res) {
  if (req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const role = new Role();
  const department = new Department();

  department
    .readOne({ id: req.query.department_id })
    .then((response) => {
      role
        .readMany({ department_id: req.query.department_id })
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

function getRoleOne(req, res) {
  if (req.query.role_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const role = new Role();
  role
    .readOne({ id: req.query.role_id })
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

function updateRole(req, res) {
  if (req.body.role_id == null || req.body.name == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const role = new Role();
  role
    .update(req.body.role_id, req.body.name)
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

function deleteRole(req, res) {
  if (req.body.role_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const role = new Role();
  role
    .delete(req.body.role_id)
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

function createWorker(req, res) {
  const { worker_array } = req.body;

  if (!Array.isArray(worker_array) || worker_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = worker_array.map((workers) => {
    const { name, user_num, user_id, user_pwd, phone, role_id, hotel_id } =
      workers;

    if (
      name == null ||
      user_num == null ||
      user_id == null ||
      user_pwd == null ||
      phone == null ||
      role_id == null ||
      hotel_id == null
    ) {
      return Promise.reject
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const worker = new Worker();
    return worker.create(
      name,
      user_num,
      user_id,
      user_pwd,
      phone,
      role_id,
      hotel_id
    );
  });

  // 모든 Promise가 처리된 후 응답
  Promise.allSettled(promises)
    .then((results) => {
      const successResponses = results
        .filter((result) => result.status === "fulfilled")
        .map((result) => result.value);
      const failedResponses = results
        .filter((result) => result.status === "rejected")
        .map((result) => result.reason);

      if (failedResponses.length > 0) {
        console.log(failedResponses);
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(failedResponses);
      } else {
        return res.status(message["200_SUCCESS"].status).send(successResponses);
      }
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

//   // 모든 Promise가 처리된 후 응답
//   Promise.allSettled(promises)
//     .then((responses) => {
//       // 모든 응답이 성공적인지 확인
//       if (responses.every((response) => response.status === 200)) {
//         return res.status(message["200_SUCCESS"].status).send(responses);
//       } else {
//         // 응답 중 하나라도 실패한 경우 첫 번째 실패 응답을 반환
//         const errorResponse = responses.find(
//           (response) => response.status !== 200
//         );
//         console.log(errorResponse);
//         return res.status(errorResponse.status).send(errorResponse);
//       }
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

// 배열 -> 단일로 입력받게끔 수정
// function createWorker(req, res) {
//   if (
//     req.body.name == null ||
//     req.body.user_num == null ||
//     req.body.user_id == null ||
//     req.body.user_pwd == null ||
//     req.body.phone == null ||
//     req.body.role_id == null ||
//     req.body.hotel_id == null
//   ) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   const worker = new Worker();
//   worker
//     .create(
//       req.body.name,
//       req.body.user_num,
//       req.body.user_id,
//       req.body.user_pwd,
//       req.body.phone,
//       req.body.role_id,
//       req.body.hotel_id
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

// ID/PW 기반 사용자 인증 후 Access Token 발급 API

function getTokensByWorkerAccountInfo(req, res) {
  if (!req.query.user_id || !req.query.user_pwd || !req.query.hotel_id) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const worker = new Worker();
  const hotel = new Hotel();

  hotel.readOne({ id: req.query.hotel_id }).then((hotel) => {
    if (!hotel) {
      return res
        .status(message["401_UNAUTHORIZED"].status)
        .send(
          message.issueMessage(message["401_UNAUTHORIZED"], "HOTEL_NOT_FOUND")
        );
    }

    console.log("hello");
    worker
      .readOne({
        user_id: req.query.user_id,
        user_pwd: req.query.user_pwd,
      })
      .then((worker) => {
        if (!worker) {
          return res
            .status(message["401_UNAUTHORIZED"].status)
            .send(
              message.issueMessage(
                message["401_UNAUTHORIZED"],
                "WORKER_NOT_FOUND"
              )
            );
        }

        console.log(worker.worker.dataValues);

        // 사용자가 인증 후 JWT 토큰 발행
        jwt
          .signAccessToken({
            id: worker.worker.dataValues.id,
            name: worker.worker.dataValues.name,
            user_id: worker.worker.dataValues.user_id,
            hotel_id: worker.worker.dataValues.hotel_id,
          })
          .then((response) => {
            // 토큰을 쿠키에 저장 및 클라이언트에게 반환
            return (
              res.cookie("access_token", response.access_token, {
                httpOnly: true,
              }),
              res.cookie("refresh_token", response.refresh_token, {
                httpOnly: true,
              }),
              res.status(message["200_SUCCESS"].status),
              res.send({
                message: "로그인이 성공적으로 처리되었습니다.",
                access_token: response.access_token,
                hotel_id: worker.worker.dataValues.hotel_id,
              })
            );
          })
          .catch((error) => {
            console.log(error);
            if (error.status) {
              return res.status(error.status).send(error);
            } else {
              return res.status(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            }
          });
      })
      .catch((error) => {
        console.error(error);
        return res
          .status(message["401_UNAUTHORIZED"].status)
          .send(
            message.issueMessage(
              message["401_UNAUTHORIZED"],
              "WORKER_NOT_FOUND"
            )
          );
      });
  });
}

//refresh Token 생성
function refreshToken(req, res) {
  if (!req.body.refresh_token) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  jwt
    .refreshToken(req.body.refresh_token)
    .then((response) => {
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
}

//토큰 값 기반 로그인 및 프로필 라우트
function getProfileByToken(req, res) {
  // if (!req.query.user_id || !req.query.user_pwd) {
  //   return res
  //     .status(message["401_UNAUTHORIZED"].status)
  //     .send(
  //       message.issueMessage(
  //         message["401_UNAUTHORIZED"],
  //         "ACCESS_TOKEN_NOT_FOUND"
  //       )
  //     );
  // }
  if (!req.query.hotel_id) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_HOTEL_ID"));
  }

  const accessToken = req.cookies.access_token;
  console.log(accessToken);

  if (!accessToken) {
    return res
      .status(message["401_UNAUTHORIZED"].status)
      .send(
        message.issueMessage(
          message["401_UNAUTHORIZED"],
          "ACCESS_TOKEN_NOT_FOUND"
        )
      );
  }

  jwt
    .verifyToken(accessToken)
    .then((response) => {
      const worker = new Worker();
      worker
        .readOne({ user_id: response.payload.user_id })
        .then((worker) => {
          if (!worker) {
            return res
              .status(message["401_UNAUTHORIZED"].status)
              .send(
                message.issueMessage(
                  message["401_UNAUTHORIZED"],
                  "WORKER_NOT_FOUND"
                )
              );
          }

          if (req.query.hotel_id != response.payload.hotel_id) {
            return res
              .status(message["401_UNAUTHORIZED"].status)
              .send(
                message.issueMessage(
                  message["401_UNAUTHORIZED"],
                  "HOTEL_NOT_MATCH"
                )
              );
          }

          console.log(worker.worker.dataValues);
          console.log("200_LOGIN_SUCCESS");

          return res.status(message["200_SUCCESS"].status).send({
            status: true,
            message: "LOGIN_SUCCESS",
            data: worker.worker.dataValues,
          });
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(message["401_UNAUTHORIZED"].status)
            .send(
              message.issueMessage(
                message["401_UNAUTHORIZED"],
                "WORKER_NOT_FOUND"
              )
            );
        });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["498_INVALID_TOKEN"].status)
        .send(
          message.issueMessage(message["498_INVALID_TOKEN"], "INVALID_TOKEN")
        );
    });
}

function updateFCMTokenforWebByAccount(req, res) {
  if (!req.query.user_id || !req.query.user_pwd || !req.query.fcm_token_web) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  var worker = new Worker();

  worker
    .readOne({ user_id: req.query.user_id, user_pwd: req.query.user_pwd })
    .then((workerInfoResponse) => {
      if (
        workerInfoResponse.worker.dataValues.fcm_token_web == null ||
        workerInfoResponse.worker.dataValues.fcm_token_web == undefined
      ) {
        workerInfoResponse.worker.dataValues.fcm_token_web = "[]";
      }
      console.log(workerInfoResponse.worker.dataValues);
      var fcmTokenJSON = workerInfoResponse.worker.dataValues.fcm_token_web;

      try {
        fcmTokenJSON = workerInfoResponse.worker.dataValues.fcm_token_web;
        if (!Array.isArray(fcmTokenJSON)) {
          fcmTokenJSON = [];
        }
      } catch (e) {
        fcmTokenJSON = [];
      }

      var existFCMToken = false;
      for (var i = 0; i < fcmTokenJSON.length; ++i) {
        if (fcmTokenJSON[i] == req.query.fcm_token_web) {
          existFCMToken = true;
          break;
        }
      }
      if (existFCMToken) {
        return res.status(message["200_SUCCESS"].status).send({
          status: true,
          message:
            "FCMTOKEN FOR WEB ALREADY EXIST, NOT UPDATING FCM TOKEN , LOGIN_SUCCESS",
          data: workerInfoResponse.worker.dataValues,
        });
      } else {
        fcmTokenJSON.push(req.query.fcm_token_web);
        worker
          .updateFCMTokenforWeb(workerInfoResponse.worker.id, fcmTokenJSON)
          .then((response) => {
            return res.status(message["200_SUCCESS"].status).send({
              status: true,
              message: "FCM TOKEN FOR WEB UPDATED, LOGIN_SUCCESS",
              data: workerInfoResponse.worker.dataValues,
            });
          })
          .catch((error) => {
            return res.status(error.status).send(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(message["404_NOT_FOUND"].status)
        .send(
          message.issueMessage(message["400_NOT_FOUND"], "WORKER_NOT_FOUND")
        );
    });
}

//   const worker = new Worker();
//   worker
//     .readOne({
//       user_id: req.query.user_id,
//       user_pwd: req.query.user_pwd,
//     })
//     .then((worker) => {
//       if (!worker) {
//         return res
//           .status(message["401_UNAUTHORIZED"].status)
//           .send(
//             message.issueMessage(
//               message["401_UNAUTHORIZED"],
//               "WORKER_NOT_FOUND"
//             )
//           );
//       }

//       console.log(worker.worker.dataValues);
//       console.log("200_SUCCESS");
//       return res.status(message["200_SUCCESS"].status).send({
//         // message.issueMessage(message["200_SUCCESS"], "LOGIN_SUCCESS"),
//         status: true,
//         message: "LOGIN_SUCCESS",
//         data: worker.worker.dataValues,
//       });
//     })
//     .catch((error) => {
//       console.error(error);
//       return res
//         .status(message["401_UNAUTHORIZED"].status)
//         .send(
//           message.issueMessage(message["401_UNAUTHORIZED"], "WORKER_NOT_FOUND")
//         );
//     });
// }

//로그아웃 라우트
function logoutWorker(req, res) {
  res.clearCookie("access_token");

  if (!req.query.worker_id) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_WORKER_ID"));
  }

  const worker = new Worker();
  worker.updateFCMTokenforWeb(req.query.worker_id, []).then((response) => {
    return res.status(response.status).send({
      response: response,
      message: "LOGOUT_SUCCESS, COOKIE DELETE & WEB_TOKEN_DELETED",
    });
  });
  // console.log("200_SUCCESS");
  // res.send({
  //   status: true,
  //   message: "LOGOUT_SUCCESS",
  // });
}

function updateWorkerWebAppTokenasNull(req, res) {
  const worker = new Worker();
  worker
    .updateFCMTokenAppWebasNULL()
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

function getWorkerMany(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const order = req.query.order != null ? JSON.parse(req.query.order) : [];
  const worker = new Worker();
  const hotel = new Hotel();

  hotel
    .readOne({ id: req.query.hotel_id })
    .then((response) => {
      worker
        .readMany({ hotel_id: req.query.hotel_id }, order)
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

var variable =
  "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(
    ","
  );
var randomPassword = createRandomPassword(variable, 8);

//비밀번호 랜덤 함수
function createRandomPassword(variable, passwordLength) {
  var randomString = "";
  for (var j = 0; j < passwordLength; j++)
    randomString += variable[Math.floor(Math.random() * variable.length)];
  return randomString;
}

// user 비밀번호 찾기
// info@rosegoldsoftware.co.kr
function findUserPwd(req, res) {
  if (
    req.query.user_id == null ||
    req.query.user_num == null ||
    req.query.user_email == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker.readOne(req.query.user_id).then((response) => {
    if (response.dataValues.user_num == req.query.user_num) {
      console.log("USER_FOUND, SEND_EMAIL");

      // 이메일 전송
      const transporter = nodemailer.createTransport({
        service: "gmail",
        port: 6060,
        secure: true, // true for 6060, false for other ports
        auth: {
          // 이메일을 보낼 계정 데이터 입력
          user: "@gmail.com",
          pass: "password",
        },
      });
      const emailOptions = {
        // 옵션값 설정
        from: "@gmail.com",
        to: req.query.user_email,
        subject: "Rosegold에서 임시비밀번호를 알려드립니다.",
        html:
          "<h1 >Rosegold에서 새로운 비밀번호를 알려드립니다.</h1> <h2> 비밀번호 : " +
          randomPassword +
          "</h2>" +
          '<h3 style="color: crimson;">임시 비밀번호로 로그인 하신 후, 반드시 비밀번호를 수정해 주세요.</h3>' +
          '<img src="https://firebasestorage.googleapis.com/v0/b/mangoplate-a1a46.appspot.com/o/mailImg.png?alt=media&token=75e07db2-5aa6-4cb2-809d-776ba037fdec">',
      };
      transporter.sendMail(emailOptions, res); //전송

      return res.status(response.status).send(response);
    } else {
      return res
        .status(message["401_UNAUTHORIZED"].status)
        .send(
          message.issueMessage(
            message["401_UNAUTHORIZED"],
            "USER_NUM_NOT_MATCH"
          )
        );
    }
  });
}

function getWorkerManyByDepartment(req, res) {
  if (req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const order = req.query.order != null ? JSON.parse(req.query.order) : [];
  const worker = new Worker();
  worker
    .readManyByDepartment(req.query.department_id, order)
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

function getWorkerManyByDepartment2(req, res) {
  if (req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker
    .readManyByDepartment2(req.query.department_id)
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

function getWorkerManyByHotelAndDepartment(req, res) {
  if (req.query.hotel_id == null || req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const worker = new Worker();
  worker
    .readManyByHotelAndDepartment(req.query.hotel_id, req.query.department_id)
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

function getWorkerOne(req, res) {
  if (req.query.worker_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const worker = new Worker();
  worker
    .readOne({ id: req.query.worker_id })
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

function updateWorker(req, res) {
  const { worker_array } = req.body;

  if (!Array.isArray(worker_array) || worker_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }
  const promises = worker_array.map((workers) => {
    const { worker_id, name, phone, role_id } = workers;

    if (worker_id == null || name == null || phone == null || role_id == null) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const worker = new Worker();
    worker.update(worker_id, name, phone, role_id);
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
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

function updateWorkerProfile(req, res) {
  if (
    req.body.worker_id == null ||
    req.body.name == null ||
    req.body.user_num == null ||
    req.body.phone == null ||
    req.body.role_id == null ||
    req.body.user_pwd == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker
    .updateProfile(
      req.body.worker_id,
      req.body.name,
      req.body.user_num,
      req.body.phone,
      req.body.role_id,
      req.body.user_pwd
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

//   // const { worker_array } = req.body;

//   // if (!Array.isArray(worker_array) || worker_array.length === 0) {
//   //   return res
//   //     .status(message["400_BAD_REQUEST"].status)
//   //     .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
//   // }

//   // const promises = worker_array.map((workers) => {
//   //   const { worker_id, name, user_num, phone, role_id, user_pwd } = workers;

//   if (
//     worker_id == null ||
//     name == null ||
//     user_num == null ||
//     phone == null ||
//     role_id == null ||
//     user_pwd == null
//   ) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(
//           message["400_BAD_REQUEST"],
//           "SEND_ALL_PARAMETERS"
//         )
//       );
//   }

//   const worker = new Worker();
//   worker.updateProfile(worker_id, name, user_num, phone, role_id, user_pwd);
//   };

//   // // 모든 Promise가 처리된 후 응답
//   // Promise.all(promises)
//   //   .then((responses) => {
//   //     // 모든 응답이 성공적인지 확인
//   //     if (responses.every((response) => response.status === 200)) {
//   //       return res.status(message["200_SUCCESS"].status).send(responses);
//   //     } else {
//   //       // 응답 중 하나라도 실패한 경우 첫 번째 실패 응답을 반환
//   //       const errorResponse = responses.find(
//   //         (response) => response.status !== 200
//   //       );
//   //       console.log(errorResponse);
//   //       return res.status(errorResponse.status).send(errorResponse);
//   //     }
//   //   })
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

// hotel_admin_user UPDTATE API
function updateWorkerAdmin(req, res) {
  if (req.body.worker_id == null || req.body.hotel_admin_user == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker
    .updateAdmin(req.body.worker_id, req.body.hotel_admin_user)
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

function deleteWorker(req, res) {
  if (req.body.worker_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker
    .delete(req.body.worker_id)
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

// 직원-부서 선택 API

function updateAssignLog(req, res) {
  if (req.body.user_id == null || req.body.role_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const assignlog = new Role_Assign_Log();
  assignlog
    .updateAssignLog(req.body.user_id, req.body.role_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function createRoom(req, res) {
  const { room_array } = req.body;

  if (!Array.isArray(room_array) || room_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = room_array.map((rooms) => {
    const {
      hotel_id,
      name,
      floor_id,
      price,
      room_grade_id,
      additional_service,
    } = rooms;

    if (
      hotel_id == null ||
      name == null ||
      floor_id == null ||
      price == null ||
      room_grade_id == null ||
      additional_service == null
    ) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const room = new Room();
    room.findRoom({ hotel_id: hotel_id, name: name }).then((result) => {
      if (!result.canCreate) {
        return res
          .status(message["409_CONFLICT"].status)
          .send(
            message.issueMessage(message["409_CONFLICT"], "ROOM_ALREADY_EXISTS")
          );
      } else {
        room.create(
          hotel_id,
          name,
          floor_id,
          price,
          room_grade_id,
          additional_service
        );
      }
    });
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
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
//       .then((response) => {
//         return res.status(response.status).send(response);
//       })
//       .catch((error) => {
//         console.error(error);
//         return res
//           .status(message["500_SERVER_INTERNAL_ERROR"].status)
//           .send(
//             message.issueMessage(
//               message["500_SERVER_INTERNAL_ERROR"],
//               "UNDEFINED_ERROR"
//             )
//           );
//       });
//   }
// })
// .catch((error) => {
//   console.error(error);
//   return res
//     .status(message["500_SERVER_INTERNAL_ERROR"].status)
//     .send(
//       message.issueMessage(
//         message["500_SERVER_INTERNAL_ERROR"],
//         "UNDEFINED_ERROR"
//       )
//     );
// });

// if (
//   req.body.hotel_id == null ||
//   req.body.name == null ||
//   req.body.floor_id == null
// ) {
//   return res
//     .status(message["400_BAD_REQUEST"].status)
//     .send(
//       message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
//     );
// }

// const room = new Room();

// room
//   .findRoom({ hotel_id: req.body.hotel_id, name: req.body.name })
//   .then((result) => {
//     if (!result.canCreate) {
//       return res
//         .status(message["409_CONFLICT"].status)
//         .send(
//           message.issueMessage(message["409_CONFLICT"], "ROOM_ALREADY_EXISTS")
//         );
//     } else {
//       room
//         .create(
//           req.body.hotel_id,
//           req.body.name,
//           req.body.floor_id,
//           req.body.price,
//           req.body.room_grade_id
//         )
//         .then((response) => {
//           return res.status(response.status).send(response);
//         })
//         .catch((error) => {
//           console.error(error);
//           return res
//             .status(message["500_SERVER_INTERNAL_ERROR"].status)
//             .send(
//               message.issueMessage(
//                 message["500_SERVER_INTERNAL_ERROR"],
//                 "UNDEFINED_ERROR"
//               )
//             );
//         });
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//     return res
//       .status(message["500_SERVER_INTERNAL_ERROR"].status)
//       .send(
//         message.issueMessage(
//           message["500_SERVER_INTERNAL_ERROR"],
//           "UNDEFINED_ERROR"
//         )
//       );
//   });
//}

function getRoomMany(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readMany({ hotel_id: req.query.hotel_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function getRoomFloors(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readManyFloors({ hotel_id: req.query.hotel_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function getRoomManyByFloor(req, res) {
  if (req.query.hotel_id == null || req.query.floor_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readMany({ hotel_id: req.query.hotel_id, floor_id: req.query.floor_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function getRoomManyByRoomGrade(req, res) {
  if (req.query.hotel_id == null || req.query.room_grade_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readMany({
      hotel_id: req.query.hotel_id,
      room_grade_id: req.query.room_grade_id,
    })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function getRoomManyByCheckin(req, res) {
  if (req.query.hotel_id == null || req.query.checkin_status == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readMany({
      hotel_id: req.query.hotel_id,
      checkin_status: req.query.checkin_status,
    })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function getRoomOne(req, res) {
  if (req.query.room_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readOne({ id: req.query.room_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function getRoomOneByName(req, res) {
  if (req.query.room_name == null || req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readOne({ name: req.query.room_name, hotel_id: req.query.hotel_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function updateRoom(req, res) {
  const { room_array } = req.body;

  if (!Array.isArray(room_array) || room_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = room_array.map((rooms) => {
    const { room_id, name, floor_id } = rooms;

    if (room_id == null || name == null || floor_id == null) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const room = new Room();
    room.update(room_id, name, floor_id);
  });

  // 모든 Promise가 처리된 후 응답
  Promise.all(promises)
    .then((responses) => {
      // 모든 응답이 성공적인지 확인
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
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
// .then((response) => {
//   return res.status(response.status).send(response);
// })
// .catch((error) => {
//   console.log(error);
//   return res
//     .status(message["500_SERVER_INTERNAL_ERROR"].status)
//     .send(
//       message.issueMessage(
//         message["500_SERVER_INTERNAL_ERROR"],
//         "UNDEFINED_ERROR"
//       )
//     );
// });

// if (
//   req.body.room_id == null ||
//   req.body.name == null ||
//   req.body.floor_id == null
// ) {
//   return res
//     .status(message["400_BAD_REQUEST"].status)
//     .send(
//       message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
//     );
// }

// const room = new Room();
// room
//   .update(req.body.room_id, req.body.name, req.body.floor_id)
//   .then((response) => {
//     return res.status(response.status).send(response);
//   })
//   .catch((error) => {
//     console.error(error);
//     return res
//       .status(message["500_SERVER_INTERNAL_ERROR"].status)
//       .send(
//         message.issueMessage(
//           message["500_SERVER_INTERNAL_ERROR"],
//           "UNDEFINED_ERROR"
//         )
//       );
//   });
//}

function updateRoomPrice(req, res) {
  if (req.query.room_id == null || req.query.price == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .updatePrice(req.query.room_id, req.query.price)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

// 호텔 방별 등급 부여 API
function updateRoomGrade(req, res) {
  if (req.query.room_id == null || req.query.room_grade_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .updateGrade(req.query.room_id, req.query.room_grade_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

//호텔 방별 금액 추가 API
function updateRoomPriceAdd(req, res) {
  if (req.query.room_id == null || req.query.addprice == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(meesage["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .addPrice(req.query.room_id, req.query.addprice)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(meesage["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

// function updateRoomCheckinStatusbyArray(req, res) {
//   const { room_array } = req.body;

//   if (!Array.isArray(room_array) || room_array.length === 0) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
//   }

//   const promises = room_array.map((rooms) => {
//     const { room_id, checkin_status } = rooms;

//     if (room_id == null || checkin_status == null) {
//       return res
//         .status(message["400_BAD_REQUEST"].status)
//         .send(
//           message.issueMessage(
//             message["400_BAD_REQUEST"],
//             "SEND_ALL_PARAMETERS"
//           )
//         );
//     }

//     const room = new Room();
//     room.updateCheckinStatus(room_id, checkin_status);
//   });

//   Promise.all(promises)
//     .then((responses) => {
//       if (responses.every((response) => response.status === 200)) {
//         return res.status(message["200_SUCCESS"].status).send(responses);
//       } else {
//         const errorResponse = responses.find(
//           (response) => response.status !== 200
//         );
//         return res.status(errorResponse.status).send(errorResponse);
//       }
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

// 배열로 입력받게끔 변경

// function checkoutRoom(req, res) {
//   if (req.query.room_id == null) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
//       );
//   }

//   const room = new Room();
//   const requirement_log = new Requirement_Log();
//   const chatting_log = new Chatting_Log();

//   room
//     .updatePrice(req.query.room_id, 0)
//     .then((response) => {
//       return room.updateAdditionalService(req.query.room_id, 0);
//     })
//     .then((response) => {
//       return requirement_log.deletebyRoomID(req.query.room_id);
//     })
//     .then((response) => {
//       return chatting_log.deletebyRoomID(req.query.room_id);
//     })
//     .then((response) => {
//       return res.status(response.status).send(response);
//     })
//     .catch((error) => {
//       console.error(error);
//       return res.status(error.status).send(error);
//     });
// }

function updateRoomCheckinStatusbyArray(req, res) {
  const { room_array } = req.body;

  if (!Array.isArray(room_array) || room_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const invalidEntry = room_array.find(
    (rooms) => rooms.room_id == null || rooms.checkin_status == null
  );
  if (invalidEntry) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const promises = room_array.map(({ room_id, checkin_status }) => {
    const room = new Room();
    return room.updateCheckinStatus(room_id, checkin_status);
  });

  Promise.all(promises)
    .then((responses) => {
      if (responses.every((response) => response.status === 200)) {
        return res.status(message["200_SUCCESS"].status).send(responses);
      } else {
        const errorResponse = responses.find(
          (response) => response.status !== 200
        );
        return res.status(errorResponse.status).send(errorResponse);
      }
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(error.status || message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          error.status
            ? error
            : message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
        );
    });
}

// 사물함 api 에서 활용 예정
// function updateRoomCheckinStatusNamebyArray(req, res) {
//   const { room_array } = req.body;

//   if (!Array.isArray(room_array) || room_array.length === 0) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
//   }

//   const invalidEntry = room_array.find(
//     (rooms) => rooms.room_id == null || rooms.checkin_status == null
//   );
//   if (invalidEntry) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   const promises = room_array.map(({ room_id, checkin_status }) => {
//     const room = new Room();
//     return room.updateCheckinStatus(room_id, checkin_status);
//   });

//   Promise.all(promises)
//     .then((responses) => {
//       if (responses.every((response) => response.status === 200)) {
//         return res.status(message["200_SUCCESS"].status).send(responses);
//       } else {
//         const errorResponse = responses.find(
//           (response) => response.status !== 200
//         );
//         return res.status(errorResponse.status).send(errorResponse);
//       }
//     })
//     .catch((error) => {
//       console.log(error);
//       return res
//         .status(error.status || message["500_SERVER_INTERNAL_ERROR"].status)
//         .send(
//           error.status
//             ? error
//             : message.issueMessage(
//                 message["500_SERVER_INTERNAL_ERROR"],
//                 "UNDEFINED_ERROR"
//               )
//         );
//     });
// }

function checkoutRoom(req, res) {
  const { results } = req.body;

  if (!Array.isArray(results)) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const room = new Room();
  const requirement_log = new Requirement_Log();
  const chatting_log = new Chatting_Log();

  const roomCheckoutPromises = results.map(({ room_id }) => {
    return room
      .updatePrice(room_id, 0)
      .then(() => room.updateAdditionalService(room_id, 0))
      .then(() => requirement_log.deletebyRoomID(room_id))
      .then(() => chatting_log.deletebyRoomID(room_id))
      .then(() => room.updateCheckinStatus(room_id, 0));
  });

  Promise.all(roomCheckoutPromises)
    .then((responses) => {
      return res.status(200).send({
        status: "success",
        message: "ALL_ROOMS_CHECKOUT_SUCCESS",
        responses,
      });
    })
    .catch((error) => {
      console.error(error);
      return res.status(error.status).send({
        status: "error",
        message: "ERROR DURING CHECKOUT",
        error,
      });
    });
}

function deleteRoom(req, res) {
  if (req.body.room_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .delete(req.body.room_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

function deleteRoombyHotel(req, res) {
  if (req.body.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .deletebyHotelID(req.body.hotel_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(message["500_SERVER_INTERNAL_ERROR"].status)
        .send(
          message.issueMessage(
            message["500_SERVER_INTERNAL_ERROR"],
            "UNDEFINED_ERROR"
          )
        );
    });
}

// function getAccessTokenByAccount(req, res) {
//   if (!req.query.user_id || !req.query.user_pwd || !req.query.fcm_token) {
//     console.log("Send all parameters");
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   var worker = new Worker();

//   worker
//     .readOne({ user_id: req.query.user_id, user_pwd: req.query.user_pwd })
//     .then((workerInfoResponse) => {
//       if (!workerInfoResponse.worker) {
//         console.log("Worker not found");
//         return res
//           .status(message["400_BAD_REQUEST"].status)
//           .send(
//             message.issueMessage(message["400_BAD_REQUEST"], "WORKER_NOT_FOUND")
//           );
//       }

//       var workerData = workerInfoResponse.worker.dataValues;

//       console.log("Worker found:", workerInfoResponse.worker);

//       // fcm_token 값을 배열로 초기화
//       let fcmTokenJSON;
//       try {
//         fcmTokenJSON = workerInfoResponse.worker.dataValues.fcm_token;
//         if (!Array.isArray(fcmTokenJSON)) {
//           fcmTokenJSON = [];
//         }
//       } catch (e) {
//         fcmTokenJSON = [];
//       }

//       console.log("Parsed fcmTokenJSON:", fcmTokenJSON);

//       if (req.query.fcm_token === "{}") {
//         // Case 1: fcm_token value is '{}'
//         jwt
//           .signAccessToken({
//             id: workerInfoResponse.worker.id,
//             name: workerInfoResponse.worker.name,
//             user_id: workerInfoResponse.worker.user_id,
//           })
//           .then((tokenResponse) => {
//             if (fcmTokenJSON.length > 0) {
//               fcmTokenJSON.push(tokenResponse.access_token);
//             } else {
//               fcmTokenJSON = [tokenResponse.access_token];
//             }
//             worker
//               .updateFCMToken(workerInfoResponse.worker.id, fcmTokenJSON)
//               .then((response) => {
//                 worker
//                   .readOne({ user_id: req.query.user_id })
//                   .then((workerdatares) => {
//                     console.log("FCM token updated successfully");
//                     return res.status(tokenResponse.status).send({
//                       ...tokenResponse,
//                       message: "FCM_TOKEN_UPDATED",
//                       worker: workerdatares,
//                     });
//                   })
//                   .catch((error) => {
//                     console.log("Error updating FCM token:", error);
//                     return res.status(error.status).send(error);
//                   });
//               });
//           })
//           .catch((error) => {
//             console.log("Error generating access token:", error);
//             return res.status(error.status).send(error);
//           });
//       } else {
//         // Case 2: fcm_token value is specific token
//         var existFCMToken = fcmTokenJSON.includes(req.query.fcm_token);
//         `
// `
//         if (existFCMToken) {
//           console.log(
//             "Existing FCM token found, logging in without generating new token"
//           );
//           return res.status(message["200_SUCCESS"].status).send({
//             status: message["200_SUCCESS"].status,
//             message: "EXISTING_FCM_TOKEN_FOUND, LOG_IN_SUCCESS",
//             worker: workerData,
//           });
//         } else {
//           console.log("No existing FCM token found, invalid FCM token");
//           return res
//             .status(message["400_BAD_REQUEST"].status)
//             .send(
//               message.issueMessage(
//                 message["400_BAD_REQUEST"],
//                 "INVALID_FCM_TOKEN"
//               )
//             );
//         }
//       }
//     })
//     .catch((error) => {
//       console.log("Error finding worker:", error);
//       return res.status(error.status).send(error);
//     });
// }

function getAccessTokenByAccount(req, res) {
  if (!req.query.user_id || !req.query.user_pwd || !req.query.fcm_token) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  var worker = new Worker();

  worker
    .readOne({ user_id: req.query.user_id, user_pwd: req.query.user_pwd })
    .then((workerInfoResponse) => {
      jwt
        .signAccessToken({
          id: workerInfoResponse.worker.id,
          name: workerInfoResponse.worker.name,
          user_id: workerInfoResponse.worker.user_id,
        })
        .then((tokenResponse) => {
          if (
            workerInfoResponse.worker.dataValues.fcm_token == null ||
            workerInfoResponse.worker.dataValues.fcm_token == undefined
          ) {
            workerInfoResponse.worker.dataValues.fcm_token = "[]";
          }
          console.log(workerInfoResponse.worker.dataValues);
          var fcmTokenJSON = workerInfoResponse.worker.dataValues.fcm_token;

          try {
            fcmTokenJSON = workerInfoResponse.worker.dataValues.fcm_token;
            if (!Array.isArray(fcmTokenJSON)) {
              fcmTokenJSON = [];
            }
          } catch (e) {
            fcmTokenJSON = [];
          }

          var existFCMToken = false;
          for (var i = 0; i < fcmTokenJSON.length; ++i) {
            if (fcmTokenJSON[i] == req.query.fcm_token) {
              existFCMToken = true;
              break;
            }
          }
          if (existFCMToken) {
            return res.status(message["200_SUCCESS"].status).send({
              status: true,
              message:
                "FCMTOKEN ALREADY EXIST, NOT UPDATING FCM TOKEN , LOGIN_SUCCESS",
              data: workerInfoResponse.worker.dataValues,
              tokenResponse,
            });
          } else {
            fcmTokenJSON.push(req.query.fcm_token);
            worker
              .updateFCMToken(workerInfoResponse.worker.id, fcmTokenJSON)
              .then((response) => {
                return res.status(message["200_SUCCESS"].status).send({
                  status: true,
                  message: "FCM TOKEN UPDATED, LOGIN_SUCCESS",
                  data: workerInfoResponse.worker.dataValues,
                  tokenResponse,
                });
              })
              .catch((error) => {
                return res.status(error.status).send(error);
              });
          }
        });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(message["404_NOT_FOUND"].status)
        .send(
          message.issueMessage(message["400_NOT_FOUND"], "WORKER_NOT_FOUND")
        );
    });
}

function updateWorkStatus(req, res) {
  if (!req.user || !req.body.status) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  var worker = new Worker();
  worker
    .readWorkLogRecentOne({
      user_id: req.user.id,
    })
    .then((workLogResponse) => {
      console.log("\n\nworkLogResponse :", workLogResponse);
      console.log(
        "\n\nworkLogResponse.work_logs[0]:",
        workLogResponse.work_logs[0]
      );

      if (
        workLogResponse.work_logs.length == 0 ||
        workLogResponse.work_logs[0].dataValues.status != req.body.status
      ) {
        if (
          workLogResponse.work_logs[0].dataValues.status == "LEAVE" &&
          req.body.status == "REST"
        ) {
          return res
            .status(message["400_BAD_REQUEST"].status)
            .send(
              message.issueMessage(message["400_BAD_REQUEST"], "UNVALID_STATUS")
            );
        }

        // 조건을 만족하는 경우에만 createWorkLog 호출
        if (
          (workLogResponse.work_logs[0].dataValues.status == "LEAVE" &&
            req.body.status == "WORK") ||
          (workLogResponse.work_logs[0].dataValues.status == "WORK" &&
            req.body.status == "LEAVE") ||
          (workLogResponse.work_logs[0].dataValues.status == "ASSIGN" &&
            req.body.status == "LEAVE")
        ) {
          return worker
            .createWorkLog(req.user.id, req.body.status)
            .then((response) => {
              console.log(response);
              return res.status(response.status).send(response);
            });
        }

        const reason = req.body.reason || null;

        // REST 상태 - 배정 불가 사유 추가
        return worker
          .updateWorkLog(req.user.id, req.body.status, reason)
          .then((response) => {
            console.log("업데이트된 값: ", req.body.status, req.body.reason);
            console.log(response);
            return res.status(response.status).send(response);
          })
          .catch((error) => {
            console.log(error);
            return res.status(error.status).send(error);
          });
      } else {
        return res
          .status(message["200_SUCCESS"].status)
          .send(message["200_SUCCESS"]);
      }
    })
    .catch((error) => {
      console.log(error);
      console.log("error status : ", error.status);
      const reason = req.body.reason || null;
      worker
        .createWorkLog(req.user.id, req.body.status, reason)
        .then((response) => {
          console.log("생성된 값: ", req.body.status, req.body.reason);
          console.log(response);
          return res.status(response.status).send(response);
        })
        .catch((error) => {
          console.log(error);
          return res.status(error.status).send(error);
        });
    });
}

function readProfileInfo(req, res) {
  var worker = new Worker();
  worker
    .readProfileInfo(req.user.id)
    .then((profile) => {
      console.log("profile :", profile);
      return res.status(profile.status).send(profile);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readWorkerProcessingReqLog(req, res) {
  var requireLog = new Requirement_Log();

  requireLog
    .readMany({
      user_id: req.user.id,
      progress: 1,
    })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function readWorkerNotAssignReqLog(req, res) {
  var requireLog = new Requirement_Log();

  requireLog
    .readMany({
      progress: 0,
    })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function readWorkerProcessedReqLog(req, res) {
  var requireLog = new Requirement_Log();

  requireLog
    .readMany({
      progress: 2,
      user_id: req.user.id,
    })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function setAssignWorker(req, res) {
  var requireLog = new Requirement_Log();
  var worker = new Worker();
  // var work_log = new Work_Log();

  requireLog
    .update(req.body.requirement_log_id, req.body.progress)
    .then((response) => {
      requireLog
        .updateWorker(req.body.requirement_log_id, req.user.id)
        .then((response) => {
          worker
            .readWorkLogRecentOne({ user_id: req.user.id })
            .then((response) => {
              console.log(response);
              if (response.work_logs[0].dataValues.status == "ASSIGN") {
                return res.status(response.status).send({
                  response: response,
                  message: "ALREADY ASSIGNED REQ_LOG, NOT UPDATING STATUS",
                });
              }
              worker.updateWorkLog(req.user.id, "ASSIGN").then((response) => {
                return res.status(response.status).send({
                  response: response,
                  message: "UPDATING STATUS TO ASSIGN",
                });
              });
            })
            .catch((error) => {
              return res.status(error.status).send(error);
            });
        });
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function setAssignWorkerinWeb(req, res) {
  var requireLog = new Requirement_Log();
  var worker = new Worker();

  requireLog
    .update(req.body.requirement_log_id, req.body.progress)
    .then((response) => {
      requireLog
        .updateWorker(req.body.requirement_log_id, req.body.user_id)
        .then((response) => {
          worker
            .readWorkLogRecentOne({ user_id: req.body.user_id })
            .then((response) => {
              console.log(response);
              if (response.work_logs[0].dataValues.status == "ASSIGN") {
                return res.status(response.status).send({
                  response: response,
                  message: "ALREADY ASSIGNED REQ_LOG, NOT UPDATING STATUS",
                });
              }
              worker
                .updateWorkLog(req.body.user_id, "ASSIGN")
                .then((response) => {
                  return res.status(response.status).send({
                    response: response,
                    message: "UPDATING STATUS TO ASSIGN",
                  });
                });
            });
          // worker.createWorkLog(req.body.user_id, "ASSIGN").then((response) => {
          //   return res.status(response.status).send(response);
          // });
        })
        .catch((error) => {
          return res.status(error.status).send(error);
        });
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

// function setReqLogNotAssign(req, res) {
//   var requireLog = new Requirement_Log();
//   var cancelMessage = req.body.message;

//   requireLog
//     .update(req.body.requirement_log_id, 0)
//     .then(() => {
//       return requireLog.updateWorkerNull(req.body.requirement_log_id);
//     })
//     .catch((error) => {
//       return res.status(error.status).send(error);
//     })
//     .then(() => {
//       return requireLog.readOne({ id: req.body.requirement_log_id });
//     })
//     .catch((error) => {
//       return res.status(error.status).send(error);
//     })
//     .then((response) => {
//       var department_name = response.requirement_log.department.name;
//       var room_name = response.requirement_log.room.name;
//       var hotel_id = response.requirement_log.hotel_id;

//       var worker = new Worker();
//       return worker.readMany({ hotel_id: hotel_id });
//     })
//     .catch((error) => {
//       return res.status(error.status).send(error);
//     })
//     .then((allWorkers) => {
//       console.log(
//         "\n\n\nALL WORKERS READ BY HOTEL_ID SUCCESS :"
//         // allWorkers["workers"]
//       );

//       var sendTargetFCMTokensWeb = [];
//       for (var j = 0; j < allWorkers["workers"].length; j++) {
//         if (
//           allWorkers["workers"][j].fcm_token_web &&
//           allWorkers["workers"][j].fcm_token_web.length > 0
//         ) {
//           sendTargetFCMTokensWeb = sendTargetFCMTokensWeb.concat(
//             allWorkers["workers"][j].fcm_token_web
//           );
//         }
//       }

//       if (sendTargetFCMTokensWeb.length > 0) {
//         let _webMessage = {
//           notification: {
//             title: "로즈골드",
//             body:
//               "[" +
//               department_name +
//               "] " +
//               room_name +
//               "호 배정 업무 취소 : " +
//               cancelMessage,
//           },
//           tokens: sendTargetFCMTokensWeb,
//         };

//         return admin.messaging().sendEachForMulticast(_webMessage);
//       } else {
//         return Promise.resolve();
//       }
//     })
//     .catch((error) => {
//       return res.status(error.status).send(error);
//     })
//     .then((response) => {
//       console.log("\n\nWEB MESSAGE SEND SUCCESS :", response);
//       return res
//         .status(message["200_SUCCESS"].status)
//         .send(message["200_SUCCESS"]);
//     })
//     .catch((error) => {
//       console.log("\n\nERROR SENDING MESSAGE!!! : ", error);
//       return res
//         .status(message["500_SERVER_INTERNAL_ERROR"].status)
//         .send(error);
//     });
// }

function setReqLogNotAssign(req, res) {
  var requireLog = new Requirement_Log();
  var cancelMessage = req.body.message;

  requireLog
    .update(req.body.requirement_log_id, 0)
    .then(() => {
      return requireLog.updateWorkerNull(req.body.requirement_log_id);
    })
    .then(() => {
      requireLog
        .readMany({
          user_id: req.user.id,
          progress: 1,
        })
        .then((response) => {
          if (response.requirement_log.length > 0) {
          } else {
            return worker.updateWorkLog(req.user.id, "WORK");
          }
        });
    })
    .then(() => {
      return requireLog.readOne({ id: req.body.requirement_log_id });
    })
    .then((response) => {
      console.log(response.requirement_log);
      console.log(response.requirement_log.department.name);

      department_name = response.requirement_log.department.name;
      room_name = response.requirement_log.room.name;
      var hotel_id = response.requirement_log.hotel_id;

      let worker = new Worker();
      return worker.readMany({ hotel_id: hotel_id });
    })
    .then((allWorkers) => {
      console.log(
        "\n\n\nALL WORKERS READ BY HOTEL_ID SUCCESS"
        // allWorkers["workers"]
      );

      var sendTargetFCMTokensWeb = [];
      for (var j = 0; j < allWorkers["workers"].length; j++) {
        if (
          allWorkers["workers"][j].fcm_token_web &&
          allWorkers["workers"][j].fcm_token_web.length > 0
        ) {
          sendTargetFCMTokensWeb = sendTargetFCMTokensWeb.concat(
            allWorkers["workers"][j].fcm_token_web
          );
        }
      }

      if (sendTargetFCMTokensWeb.length > 0) {
        let _webMessage = {
          notification: {
            title: "로즈골드",
            body:
              "[" +
              department_name +
              "] " +
              room_name +
              "호 배정 업무 취소 : " +
              cancelMessage,
          },
          tokens: sendTargetFCMTokensWeb,
        };

        return admin.messaging().sendEachForMulticast(_webMessage);
      } else {
        return Promise.resolve();
      }
    })
    .then((response) => {
      console.log("\n\nWEB MESSAGE SEND SUCCESS :", response);
      return res
        .status(message["200_SUCCESS"].status)
        .send(message["200_SUCCESS"]);
    })
    .catch((error) => {
      console.log("\n\nERROR SENDING MESSAGE!!! : ", error);
      // const statusCode = error.status || 500; // 기본값을 500으로 설정
      // const errorMessage = error.message || "Internal Server Error";
      // return res
      //   .status(statusCode)
      //   .send({ status: statusCode, message: errorMessage });
      return reject(error);
    });
}

function setWorkFinish(req, res) {
  var requireLog = new Requirement_Log();
  var worker = new Worker();

  console.log(req.body.requirement_log_id);
  requireLog
    .updateProcessedInfo(req.body.requirement_log_id, req.body.processed_info)
    .then((response) => {
      requireLog
        .readMany({ user_id: req.user.id, progress: 1 })
        .then((response) => {
          // console.log("/n/n/nRESPONSE!!!!!!!!!!! :", response);
          // console.log(
          //   "/n/n/nRESPONSELENGTH!!!!!!!!!!! :",
          //   response.requirement_log.length
          // );
          if (response.requirement_log.length > 0) {
            return res.status(response.status).send(response);
          } else {
            return worker
              .updateWorkLog(req.user.id, "WORK")
              .then((response) => {
                return res.status(response.status).send({
                  response: response,
                  message: "REQ_LOG_NOT_FOUND, UPDATING TO STATUS -> WORK",
                });
              });
          }
        })
        .catch((error) => {
          if (error.detail_cause == "REQUIREMENT_LOG_NOT_FOUND") {
            return worker
              .updateWorkLog(req.user.id, "WORK")
              .then((response) => {
                return res.status(response.status).send({
                  response: response,
                  message: "REQ_LOG_NOT_FOUND, UPDATING TO STATUS -> WORK",
                });
              })
              .catch((error) => {
                return res.status(error.status).send(error);
              });
          } else {
            return res.status(error.status).send(error);
          }
        });
      // .then((response) => {
      //   return res.status(response.status).send(response);
      // });
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function sendMessage(req, res) {
  if (!req.body.to_user_id || !req.body.message_article) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }

  var message = new Message();
  message
    .sendMessage(req.body.to_user_id, req.body.message_article, req.user.id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readMessages(req, res) {
  var message = new Message();
  message
    .readMany({
      [Sequelize.Op.or]: [
        { user_id: req.user.id },
        { to_user_id: req.user.id },
      ],
    })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

function okMessage(req, res) {
  if (!req.body.message_id || !req.body.status) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message["400_BAD_REQUEST"]);
  }
  var message = new Message();
  message
    .update(req.body.message_id, req.body.status)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      return res.status(error.status).send(error);
    });
}

module.exports = {
  createHotel,
  getHotelMany,
  getHotelOne,
  updateHotel,
  updateProcessHotel,
  deleteHotel,
  createDepartment,
  getDepartmentMany,
  getDepartmentOne,
  getDepartmentBusinessHour,
  updateDepartment,
  deleteDepartment,
  createRole,
  getRoleMany,
  getRoleManyByDepartmentID,
  getRoleOne,
  updateRole,
  deleteRole,
  createWorker,
  getWorkerMany,
  getWorkerManyByDepartment,
  getWorkerManyByDepartment2,
  getWorkerManyByHotelAndDepartment,
  getWorkerOne,
  updateWorker,
  updateWorkerProfile,
  updateWorkerAdmin,
  //호텔 최고 관리자 여부 선택 추가
  deleteWorker,
  //비밀번호 찾기 - 코드 작성중
  findUserPwd,
  //토큰 발행 및 로그인 추가
  getTokensByWorkerAccountInfo,
  refreshToken,
  getProfileByToken,
  logoutWorker,
  //웹 firebase token 추가 API
  updateFCMTokenforWebByAccount,
  updateWorkerWebAppTokenasNull,
  //직원-부서 할당 추가
  updateAssignLog,
  createRoom,
  getRoomMany,
  getRoomOne,
  getRoomOneByName,
  getRoomManyByFloor,
  // 객실 층 조회 추가
  getRoomManyByRoomGrade,
  //객실 호실 등급별 조회 추가
  getRoomManyByCheckin,
  //객실 체크인 상태별 조회 추가
  getRoomFloors,
  updateRoom,
  //객실 등급 수정
  updateRoomGrade,
  //객실 가격 수정
  updateRoomPrice,
  //객실 가격 추가
  updateRoomPriceAdd,
  updateRoomCheckinStatusbyArray,
  // updateRoomCheckinStatusNamebyArray,
  deleteRoom,
  deleteRoombyHotel,
  //객실 체크아웃
  checkoutRoom,
  getAccessTokenByAccount,
  updateWorkStatus,
  readProfileInfo,
  readWorkerProcessingReqLog,
  readWorkerNotAssignReqLog,
  readWorkerProcessedReqLog,
  setAssignWorker,
  sendMessage,
  readMessages,
  okMessage,
  setWorkFinish,
  setReqLogNotAssign,
  //웹 내 업무 배정
  setAssignWorkerinWeb,
};
