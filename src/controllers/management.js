const jwt = require("../modules/jwt");
const message = require("../../config/message");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Role_Assign_Log = require("../models/hotel").Role_Assign_Log;

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

// ID/PW 기반 사용자 인증 후 JWT 발급 API

function getTokensByWorkerAccountInfo(req, res) {
  console.log(req);
  if (!req.body.user_id || !req.body.user_pwd) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const worker = new Worker();
  worker
    .readOne({
      where: {
        user_id: req.body.user_id,
        user_pwd: req.body.user_pwd,
      },
    })
    .then((worker) => {
      if (!worker) {
        return res
          .status(message["401_UNAUTHORIZED"].status)
          .send(
            message.issueMessage(
              message["401_UNAUTHORIZED"],
              "INVALID_CREDENTIALS"
            )
          );
      }

      // 사용자가 인증 후 JWT 토큰 발행
      const accessToken = jwt.signAccessToken(user);
      const refreshToken = jwt.refreshToken(user);

      // 토큰을 클라이언트에게 반환
      return res.status(message["200_OK"].status).send({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
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
  getWorkerOne,
  updateWorker,
  deleteWorker,
  //토큰 발행 추가
  getTokensByWorkerAccountInfo,
  refreshToken,
  //직원-부서 할당 추가
  updateAssignLog,
};
