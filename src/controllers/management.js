const jwt = require("../modules/jwt");
const message = require("../../config/message");
const { Room } = require("../models/hotel");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Role_Assign_Log = require("../models/hotel").Role_Assign_Log;

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

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
    .create(
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
  if (
    req.body.name == null ||
    req.body.token_name == null ||
    req.body.hotel_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const department = new Department();
  department
    .create(req.body.name, req.body.token_name, req.body.hotel_id)
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

function updateDepartment(req, res) {
  if (
    req.body.department_id == null ||
    req.body.name == null ||
    req.body.token_name == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const department = new Department();
  department
    .update(req.body.department_id, req.body.name, req.body.token_name)
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
  if (
    req.body.name == null ||
    req.body.user_num == null ||
    req.body.user_id == null ||
    req.body.user_pwd == null ||
    req.body.phone == null ||
    req.body.role_id == null ||
    req.body.hotel_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker
    .create(
      req.body.name,
      req.body.user_num,
      req.body.user_id,
      req.body.user_pwd,
      req.body.phone,
      req.body.role_id,
      req.body.hotel_id
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

// ID/PW 기반 사용자 인증 후 Access Token 발급 API

function getTokensByWorkerAccountInfo(req, res) {
  if (!req.query.user_id || !req.query.user_pwd) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const worker = new Worker();
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
          message.issueMessage(message["401_UNAUTHORIZED"], "WORKER_NOT_FOUND")
        );
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

  console.log("200_SUCCESS");
  res.send({
    status: true,
    message: "LOGOUT_SUCCESS",
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
  if (
    req.body.worker_id == null ||
    req.body.name == null ||
    req.body.phone == null ||
    req.body.role_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const worker = new Worker();
  worker
    .update(req.body.worker_id, req.body.name, req.body.phone, req.body.role_id)
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
  if (
    req.body.hotel_id == null ||
    req.body.name == null ||
    req.body.floor == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();

  room
    .findRoom({ hotel_id: req.body.hotel_id, name: req.body.name })
    .then((result) => {
      if (!result.canCreate) {
        return res
          .status(message["409_CONFLICT"].status)
          .send(
            message.issueMessage(message["409_CONFLICT"], "ROOM_ALREADY_EXISTS")
          );
      } else {
        room
          .create(
            req.body.hotel_id,
            req.body.name,
            req.body.floor,
            req.body.price,
            req.body.room_grade_id
          )
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
  if (req.query.hotel_id == null || req.query.floor == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .readMany({ hotel_id: req.query.hotel_id, floor: req.query.floor })
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

function updateRoom(req, res) {
  if (
    req.body.room_id == null ||
    req.body.name == null ||
    req.body.floor == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const room = new Room();
  room
    .update(req.body.room_id, req.body.name, req.body.floor)
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

module.exports = {
  createHotel,
  getHotelMany,
  getHotelOne,
  updateHotel,
  deleteHotel,
  createDepartment,
  getDepartmentMany,
  getDepartmentOne,
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
  getWorkerOne,
  updateWorker,
  updateWorkerProfile,
  updateWorkerAdmin,
  //호텔 최고 관리자 여부 선택 추가
  deleteWorker,
  //토큰 발행 및 로그인 추가
  getTokensByWorkerAccountInfo,
  refreshToken,
  getProfileByToken,
  logoutWorker,
  //직원-부서 할당 추가
  updateAssignLog,
  createRoom,
  getRoomMany,
  getRoomOne,
  getRoomManyByFloor,
  // 객실 층 조회 추가
  getRoomFloors,
  updateRoom,
  //객실 등급 수정
  updateRoomGrade,
  //객실 가격 수정
  updateRoomPrice,
  //객실 가격 추가
  updateRoomPriceAdd,
  deleteRoom,
};
