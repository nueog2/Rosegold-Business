const models = require("../../models");
const message = require("../../config/message");
const jwtModule = require("../modules/jwt");
const { updateRole } = require("../controllers/management");
const { Work_Log } = require("./work_log");
const { response } = require("express");

const admin = require("firebase-admin");

let serAccount = require("../../config/firebase-key.json");
const { orderBy } = require("lodash");

admin.initializeApp({
  credential: admin.credential.cert(serAccount),
});

class Hotel {
  constructor() {}

  create(
    name,
    contact_number,
    address_sido,
    address_sigungu,
    address_other,
    checkin_date,
    checkout_date
  ) {
    return new Promise((resolve, reject) => {
      models.hotel
        .create({
          name: name,
          contact_number: contact_number,
          address_sido: address_sido,
          address_sigungu: address_sigungu,
          address_other: address_other,
          checkin_date: checkin_date,
          checkout_date: checkout_date,
        })
        .then((response) => {
          if (response) {
            return resolve({
              // return resolve(message["200_SUCCESS"]);
              status: message["200_SUCCESS"].status,
              hotel: response,
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
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.hotel
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.hotels = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "HOTEL_NOT_FOUND")
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
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.hotel
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.hotel = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "HOTEL_NOT_FOUND")
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  update(
    hotel_id,
    name,
    contact_number,
    address_sido,
    address_sigungu,
    address_other,
    checkin_date,
    checkout_date
  ) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: hotel_id })
        .then((response) => {
          models.hotel
            .update(
              {
                name: name,
                contact_number: contact_number,
                address_sido: address_sido,
                address_sigungu: address_sigungu,
                address_other: address_other,
                checkin_date: checkin_date,
                checkout_date: checkout_date,
              },
              {
                where: {
                  id: hotel_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  delete(hotel_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: hotel_id })
        .then((response) => {
          models.hotel
            .destroy({
              where: {
                id: hotel_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

class Department extends Hotel {
  constructor() {
    super();
  }

  create(name, token_name, hotel_id) {
    return new Promise((resolve, reject) => {
      super
        .readOne(hotel_id)
        .then((response) => {
          models.department
            .create({
              name: name,
              token_name: token_name,
              hotel_id: hotel_id,
            })
            .then((response) => {
              if (response) {
                return resolve({
                  // (message["200_SUCCESS"]);
                  status: message["200_SUCCESS"].status,
                  department: response,
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
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.department
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.departments = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "DEPARTMENT_NOT_FOUND"
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
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.department
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.department = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "DEPARTMENT_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  update(department_id, name, token_name) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: department_id })
        .then((response) => {
          models.department
            .update(
              {
                name: name,
                token_name: token_name,
              },
              {
                where: {
                  id: department_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  // 직책-부서 삭제 코드
  delete(department_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: department_id })
        .then((response) => {
          var role = new Role();
          role
            .readMany({ department_id: department_id })
            .then((roleResponse) => {
              if (roleResponse.roles.length === 0) {
                models.department
                  .destroy({
                    where: {
                      id: department_id,
                    },
                  })
                  .then((response) => {
                    return resolve(message["200_SUCCESS"]);
                  })
                  .catch((error) => {
                    return reject(
                      message.issueMessage(
                        message["500_SERVER_INTERNAL_ERROR"],
                        "UNDEFINED_ERROR"
                      )
                    );
                  });
              } else {
                var processCount = 0;

                roleResponse.roles.forEach((_role) => {
                  role
                    .readAssignLogOne({ role_id: _role.id })
                    .then((response) => {
                      models.role_assign_log
                        .destroy({
                          where: {
                            role_id: _role.id,
                          },
                        })
                        .then((response) => {
                          models.role.destroy({
                            where: {
                              id: _role.id,
                            },
                          });
                        })
                        .then((response) => {
                          return resolve(message["200_SUCCESS"]);
                        });
                    })
                    .catch((error) => {
                      if (
                        error.status != null &&
                        error.status == message["404_NOT_FOUND"].status
                      ) {
                        processCount++;

                        if (processCount == roleResponse.roles.length) {
                          models.role
                            .destroy({
                              where: {
                                department_id: department_id,
                              },
                            })
                            .then((response) => {
                              // 부서 삭제
                              models.department
                                .destroy({
                                  where: {
                                    id: department_id,
                                  },
                                })
                                .then((response) => {
                                  return resolve(message["200_SUCCESS"]);
                                })
                                .catch((error) => {
                                  return reject(
                                    message.issueMessage(
                                      message["500_SERVER_INTERNAL_ERROR"],
                                      "UNDEFINED_ERROR"
                                    )
                                  );
                                });
                            })
                            .catch((error) => {
                              return reject(
                                message.issueMessage(
                                  message["500_SERVER_INTERNAL_ERROR"],
                                  "UNDEFINED_ERROR"
                                )
                              );
                            });
                        }
                      }
                    });
                });
              }
            })
            .catch((error) => {
              return reject(error);
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

class Role extends Department {
  constructor() {
    super();
  }

  create(name, department_id) {
    return new Promise((resolve, reject) => {
      super
        .readOne(department_id)
        .then((response) => {
          models.role
            .create({
              name: name,
              department_id: department_id,
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
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.role
        .findAll({
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.roles = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "ROLE_NOT_FOUND")
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
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.role
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.role = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "ROLE_NOT_FOUND")
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  createAssignLog(role_id, user_id) {
    return new Promise((resolve, reject) => {
      models.role_assign_log
        .create({
          role_id: role_id,
          user_id: user_id,
        })
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
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
  }

  readAssignLogOne(condition) {
    return new Promise((resolve, reject) => {
      models.role_assign_log
        .findOne({
          include: [
            {
              model: models.role,
              include: [
                {
                  model: models.department,
                },
              ],
            },
          ],
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.role_assign_log = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "ROLE_ASSIGN_LOG_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  deleteAssignLogByUserID(user_id) {
    return new Promise((resolve, reject) => {
      models.role_assign_log
        .destroy({
          where: {
            user_id: user_id,
          },
        })
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  assign(role_id, user_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: role_id })
        .then((response) => {
          this.readAssignLogOne({ user_id: user_id })
            .then((response) => {
              deleteAssignLogByUserID(user_id)
                .then((response) => {
                  this.createAssignLog(role_id, user_id)
                    .then((response) => {
                      return resolve(response);
                    })
                    .catch((error) => {
                      return reject(error);
                    });
                })
                .catch((error) => {
                  return reject(error);
                });
            })
            .catch((error) => {
              if (
                error.status != null &&
                error.status == message["404_NOT_FOUND"].status
              ) {
                this.createAssignLog(role_id, user_id)
                  .then((response) => {
                    return resolve(response);
                  })
                  .catch((error) => {
                    return reject(error);
                  });
              } else {
                return reject(error);
              }
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  update(role_id, name) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: role_id })
        .then((response) => {
          models.role
            .update(
              {
                name: name,
              },
              {
                where: {
                  id: role_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  delete(role_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: role_id })
        .then((response) => {
          this.readAssignLogOne({ role_id: role_id })
            .then((response) => {
              models.role_assign_log
                .destroy({
                  where: {
                    role_id: role_id,
                  },
                })
                .then((response) => {
                  models.role
                    .destroy({
                      where: {
                        id: role_id,
                      },
                    })
                    .then((response) => {
                      console.log("role delete");
                      return resolve(message["200_SUCCESS"]);
                    });
                })
                .catch((error) => {
                  return reject(error);
                });
            })
            .catch((error) => {
              if (
                error.status != null &&
                error.status == message["404_NOT_FOUND"].status
              ) {
                models.role
                  .destroy({
                    where: {
                      id: role_id,
                    },
                  })
                  .then((response) => {
                    return resolve(message["200_SUCCESS"]);
                  })
                  .catch((error) => {
                    return reject(
                      message.issueMessage(
                        message["500_SERVER_INTERNAL_ERROR"],
                        "UNDEFINED_ERROR"
                      )
                    );
                  });
              } else {
                return reject(error);
              }
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }
}

class Worker extends Hotel {
  constructor() {
    super();
  }

  create(name, user_num, user_id, user_pwd, phone, role_id, hotel_id) {
    return new Promise((resolve, reject) => {
      // 먼저 user_id 중복 확인
      models.user
        .findOne({ where: { user_id: user_id } })
        .then((existingUser) => {
          if (existingUser) {
            // 중복된 user_id가 있는 경우
            return reject(
              message.issueMessage(
                message["400_BAD_REQUEST"],
                "USER_ID_ALREADY_EXISTS"
              )
            );
          } else {
            // 중복된 user_id가 없는 경우, 호텔 및 역할 읽기 시작
            super
              .readOne(hotel_id)
              .then((response) => {
                const role = new Role();
                role
                  .readOne({ id: role_id })
                  .then((response) => {
                    models.user
                      .create({
                        name: name,
                        user_num: user_num,
                        user_id: user_id,
                        user_pwd: user_pwd,
                        phone: phone,
                        hotel_id: hotel_id,
                        fcm_token: {},
                      })
                      .then((response) => {
                        if (response) {
                          role
                            .createAssignLog(role_id, response.dataValues.id)
                            .then((response) => {
                              return resolve(message["200_SUCCESS"]);
                            })
                            .catch((error) => {
                              console.log(error);
                              return reject(error);
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
                        return reject(
                          message.issueMessage(
                            message["500_SERVER_INTERNAL_ERROR"],
                            "UNDEFINED_ERROR"
                          )
                        );
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    return reject(error);
                  });
              })
              .catch((error) => {
                console.log(error);
                return reject(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "DATABASE_ERROR"
            )
          );
        });
    });
  }

  readWorkLogMany(condition) {
    return new Promise((resolve, reject) => {
      models.work_log
        .findAll({ where: condition, order: [["createdAt", "DESC"]] })
        .then((response) => {
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.work_logs = response;
          return resolve(obj);
        })
        .catch((error) => {
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }

  createWorkLog(user_id, status) {
    return new Promise((resolve, reject) => {
      models.work_log
        .create({
          user_id: user_id,
          status: status,
        })
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }

  readMany(condition, order) {
    return new Promise((resolve, reject) => {
      models.user
        .findAll({
          where: condition,
          order: order,
          include: [
            {
              model: models.work_log,
              limit: 1,
              attributes: ["status"],
              order: [["id", "DESC"]],
            },
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            const role = new Role();
            var workerList = [];

            response.forEach((worker) => {
              role
                .readAssignLogOne({ user_id: worker.id })
                .then((roleAssignResponse) => {
                  worker.dataValues.role_id =
                    roleAssignResponse.role_assign_log.role.id;
                  worker.dataValues.role_name =
                    roleAssignResponse.role_assign_log.role.name;
                  worker.dataValues.department_id =
                    roleAssignResponse.role_assign_log.role.department.id;
                  worker.dataValues.department_name =
                    roleAssignResponse.role_assign_log.role.department.name;
                  workerList.push(worker);

                  if (workerList.length == response.length) {
                    var obj = Object.assign({}, message["200_SUCCESS"]);
                    obj.workers = workerList;
                    return resolve(obj);
                  }
                })
                .catch((error) => {
                  if (
                    error.status != null &&
                    error.status == message["404_NOT_FOUND"].status
                  ) {
                    worker.dataValues.role_id = -1;
                    worker.dataValues.role_name = "";
                    worker.dataValues.department_id = -1;
                    worker.dataValues.department_name = "";

                    workerList.push(worker);

                    if (workerList.length == response.length) {
                      var obj = Object.assign({}, message["200_SUCCESS"]);
                      obj.workers = workerList;
                      return resolve(obj);
                    }
                  } else {
                    return reject(error);
                  }
                });
            });
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "WORKER_NOT_FOUND")
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
        });
    });
  }

  readManyByDepartment(department_id, order) {
    return new Promise((resolve, reject) => {
      const department = new Department();
      department
        .readOne({ id: department_id })
        .then((response) => {
          console.log(response);

          this.readMany({}, order)
            .then((usersResponse) => {
              var workersList = [];
              var processedCount = 0;
              usersResponse.workers.forEach((worker) => {
                worker = worker.dataValues;
                if (worker.department_id == department_id) {
                  workersList.push(worker);
                  // console.log("worker found :", worker);
                }

                processedCount++;
                if (usersResponse.workers.length == processedCount) {
                  if (workersList.length == 0)
                    return reject(
                      message.issueMessage(
                        message["404_NOT_FOUND"],
                        "WORKER_NOT_FOUND"
                      )
                    );
                  else {
                    var obj = Object.assign({}, message["200_SUCCESS"]);
                    obj.workers = workersList;
                    return resolve(obj);
                  }
                }
              });
            })
            .catch((error) => {
              return reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readManyByDepartment2(department_id) {
    return new Promise((resolve, reject) => {
      models.user
        .findAll({
          include: [
            {
              model: models.role_assign_log,
              include: [
                {
                  model: models.role,
                  include: [
                    {
                      model: models.department,
                      where: { id: department_id },
                    },
                  ],
                },
              ],
            },
            {
              model: models.work_log,
              limit: 1,
              attributes: ["status"],
              order: [["id", "DESC"]],
            },
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.workers = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "WORKER_NOT_FOUND")
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
        });
    });
  }

  readManyByHotelAndDepartment(hotel_id, department_id) {
    return new Promise((resolve, reject) => {
      models.user
        .findAll({
          where: {
            hotel_id: hotel_id,
          },
          include: [
            {
              model: models.role_assign_log,
              include: [
                {
                  model: models.role,
                  include: [
                    {
                      model: models.department,
                      where: { id: department_id },
                    },
                  ],
                },
              ],
            },
            {
              model: models.work_log,
              limit: 1,
              attributes: ["status"],
              order: [["id", "DESC"]],
            },
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.workers = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "WORKER_NOT_FOUND")
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
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.user
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            const role = new Role();
            role
              .readAssignLogOne({ user_id: response.dataValues.id })
              .then((roleAssignResponse) => {
                response.dataValues.role_id =
                  roleAssignResponse.role_assign_log.role.dataValues.id;
                response.dataValues.role_name =
                  roleAssignResponse.role_assign_log.role.dataValues.name;
                response.dataValues.department_id =
                  roleAssignResponse.role_assign_log.role.dataValues.department.id;
                response.dataValues.department_name =
                  roleAssignResponse.role_assign_log.role.dataValues.department.name;

                var obj = Object.assign({}, message["200_SUCCESS"]);
                obj.worker = response;
                return resolve(obj);
              })
              .catch((error) => {
                return reject(error);
              });
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "WORKER_NOT_FOUND")
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readProfileInfo(user_id) {
    return new Promise((resolve, reject) => {
      models.user
        .findOne({
          include: [{ model: models.hotel, attributes: ["id", "name"] }],
          where: {
            id: user_id,
          },
          attributes: ["id", "name", "hotel_id"],
        })
        .then((profileResponse) => {
          if (profileResponse != null) {
            const role = new Role();
            role
              .readAssignLogOne({ user_id: profileResponse.dataValues.id })
              .then((roleAssignResponse) => {
                profileResponse.dataValues.role_id =
                  roleAssignResponse.role_assign_log.role.dataValues.id.length;
                profileResponse.dataValues.role_name =
                  roleAssignResponse.role_assign_log.role.dataValues.name;
                profileResponse.dataValues.department_id =
                  roleAssignResponse.role_assign_log.role.dataValues.department.id;
                profileResponse.dataValues.department_name =
                  roleAssignResponse.role_assign_log.role.dataValues.department.name;

                this.readWorkLogMany({ user_id: user_id })
                  .then((workLogsResponse) => {
                    var requirementLog = new Requirement_Log();
                    requirementLog
                      .readMany({
                        user_id: user_id,
                        progress: 2,
                      })
                      .then((requirementLogResponse) => {
                        var obj = Object.assign({}, message["200_SUCCESS"]);
                        obj.profile = profileResponse.dataValues;
                        obj.profile.last_work_log =
                          workLogsResponse.work_logs.length > 0
                            ? workLogsResponse.work_logs[0].dataValues
                            : null;
                        obj.profile.processed_count =
                          requirementLogResponse.Total_requirement_log;
                        return resolve(obj);
                      })
                      .catch((error) => {
                        console.log(error);
                        if (error.status == message["404_NOT_FOUND"].status) {
                          var obj = Object.assign({}, message["200_SUCCESS"]);
                          obj.profile = profileResponse.dataValues;
                          obj.profile.last_work_log =
                            workLogsResponse.work_logs.length > 0
                              ? workLogsResponse.work_logs[0].dataValues
                              : null;
                          obj.profile.processed_count = 0;
                          return resolve(obj);
                        } else {
                          console.log(error);
                          return reject(error);
                        }
                      });
                  })
                  .catch((error) => {
                    console.log(error);
                    return reject(error);
                  });
              });
          } else {
            return reject(message["404_NOT_FOUND"]);
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }

  update(user_id, name, phone, role_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: user_id })
        .then((response) => {
          models.user
            .update(
              {
                name: name,
                phone: phone,
              },
              {
                where: {
                  id: user_id,
                },
              }
            )
            .then((response) => {
              const role = new Role();
              role
                .readAssignLogOne({ user_id: user_id })
                .then((response) => {
                  console.log(response.role_assign_log);
                  if (response.role_assign_log.role_id == role_id) {
                    return resolve(message["200_SUCCESS"]);
                  } else {
                    role
                      .deleteAssignLogByUserID(user_id)
                      .then((response) => {
                        role
                          .createAssignLog(role_id, user_id)
                          .then((response) => {
                            return resolve(message["200_SUCCESS"]);
                          })
                          .catch((error) => {
                            return reject(error);
                          });
                      })
                      .catch((error) => {
                        return reject(error);
                      });
                  }
                })
                .catch((error) => {
                  if (
                    error.status != null &&
                    error.status == message["404_NOT_FOUND"].status
                  ) {
                    role
                      .createAssignLog(role_id, user_id)
                      .then((response) => {
                        return resolve(message["200_SUCCESS"]);
                      })
                      .catch((error) => {
                        return reject(error);
                      });
                  } else {
                    return reject(error);
                  }
                });
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateProfile(user_id, name, user_num, phone, role_id, user_pwd) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: user_id })
        .then((response) => {
          models.user
            .update(
              {
                name: name,
                user_num: user_num,
                phone: phone,
                role_id: role_id,
                user_pwd: user_pwd,
              },
              {
                where: {
                  id: user_id,
                },
              }
            )
            .then((response) => {
              const role = new Role();
              role
                .readAssignLogOne({ user_id: user_id })
                .then((response) => {
                  console.log(response.role_assign_log);
                  if (response.role_assign_log.role_id == role_id) {
                    return resolve(message["200_SUCCESS"]);
                  } else {
                    role
                      .deleteAssignLogByUserID(user_id)
                      .then((response) => {
                        role
                          .createAssignLog(role_id, user_id)
                          .then((response) => {
                            return resolve(message["200_SUCCESS"]);
                          })
                          .catch((error) => {
                            return reject(error);
                          });
                      })
                      .catch((error) => {
                        return reject(error);
                      });
                  }
                })
                .catch((error) => {
                  if (
                    error.status != null &&
                    error.status == message["404_NOT_FOUND"].status
                  ) {
                    role
                      .createAssignLog(role_id, user_id)
                      .then((response) => {
                        return resolve(message["200_SUCCESS"]);
                      })
                      .catch((error) => {
                        return reject(error);
                      });
                  } else {
                    return reject(error);
                  }
                });
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateFCMToken(user_id, fcm_token) {
    return new Promise((resolve, reject) => {
      models.user
        .update(
          {
            fcm_token: fcm_token,
          },
          {
            where: {
              id: user_id,
            },
          }
        )
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateFCMTokenforWeb(user_id, fcm_token_web) {
    return new Promise((resolve, reject) => {
      models.user
        .update(
          {
            fcm_token_web: fcm_token_web,
          },
          {
            where: {
              id: user_id,
            },
          }
        )
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  // UPDATE hotel_admin_user
  updateAdmin(user_id, hotel_admin_user) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: user_id })
        .then((response) => {
          models.user
            .update(
              {
                hotel_admin_user: hotel_admin_user,
              },
              {
                where: {
                  id: user_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  delete(user_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: user_id })
        .then((response) => {
          models.user
            .destroy({
              where: {
                id: user_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  getTokensByWorkerAccountInfo(user_id, user_pwd) {
    return new Promise((resolve, reject) => {
      models.user
        .findOne({
          where: {
            user_id: user_id,
            user_pwd: user_pwd,
          },
        })
        .then((response) => {
          if (response) {
            signAccessToken({
              id: response.id,
              name: response.name,
              user_id: response.user_id,
            })
              .then((response) => {
                return resolve(response);
              })
              .catch((error) => {
                return reject(error);
              });
          } else {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "WORKER_NOT_FOUND")
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
        });
    });
  }
}

class Role_Assign_Log extends Role {
  constructor() {
    super();
  }

  //UPDATE ASSIGNLOG
  updateAssignLog(user_id, role_id) {
    return new Promise((resolve, reject) => {
      models.role_assign_log
        .update(
          {
            role_id: role_id,
          },
          {
            where: {
              user_id: user_id,
            },
          }
        )
        .then((response) => {
          if (response[0] > 0) {
            return resolve(message["200_SUCCESS"]);
          } else {
            models.role_assign_log
              .create({
                role_id: role_id,
                user_id: user_id,
              })
              .then((response) => {
                return resolve(message["200_SUCCESS"]);
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
  }
}

class Room extends Hotel {
  constructor() {
    super();
  }

  create(hotel_id, name, floor_id, price, room_grade_id, additional_service) {
    return new Promise((resolve, reject) => {
      models.room
        .findOne({
          where: {
            name: name,
            hotel_id: hotel_id,
          },
        })
        .then((existingRoom) => {
          if (existingRoom) {
            return reject(
              message.issueMessage(
                message["409_CONFLICT"],
                "ROOM_ALREADY_EXISTS"
              )
            );
          } else {
            models.room
              .create({
                hotel_id: hotel_id,
                name: name,
                floor_id: floor_id,
                price: price,
                room_grade_id: room_grade_id,
                additional_service: additional_service,
              })
              .then((response) => {
                return resolve(message["200_SUCCESS"]);
              })
              .catch((error) => {
                return reject(
                  message.issueMessage(
                    message["500_SERVER_INTERNAL_ERROR"],
                    "UNDEFINED_ERROR"
                  )
                );
              });
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.room
        .findAll({
          where: condition,
          include: [
            {
              model: models.floor,
              attributes: ["floor_number"],
            },
          ],
          attributes: [
            "id",
            "name",
            "floor_id",
            "hotel_id",
            "price",
            "room_grade_id",
            "additional_service",
          ],
        })
        .then((response) => {
          if (response.length == 0) {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "ROOMS_NOT_FOUND")
            );
          } else {
            // room_grade 정보 추가
            let roomPromises = response.map((room) => {
              return models.room_grade
                .findOne({
                  where: { id: room.room_grade_id },
                  attributes: ["name"],
                })
                .then((roomGrade) => {
                  room.dataValues.room_grade_name = roomGrade
                    ? roomGrade.name
                    : null;
                  return room;
                });
            });

            Promise.all(roomPromises)
              .then((roomsWithGrades) => {
                var obj = Object.assign({}, message["200_SUCCESS"]);
                obj.rooms = roomsWithGrades;
                return resolve(obj);
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
  }

  // readManyFloors(condition) {
  //   return new Promise((resolve, reject) => {
  //     models.room
  //       .findAll({
  //         where: condition,
  //         attributes: [
  //           [
  //             models.sequelize.fn("DISTINCT", models.sequelize.col("floor")),
  //             "floor",
  //           ],
  //         ],
  //       })
  //       .then((response) => {
  //         if (response.length == 0) {
  //           return reject(
  //             message.issueMessage(message["404_NOT_FOUND"], "FLOORS_NOT_FOUND")
  //           );
  //         } else {
  //           var obj = Object.assign({}, message["200_SUCCESS"]);
  //           obj.floors = response.map((room) => room.floor);

  //           return resolve(obj);
  //         }
  //       })
  //       .catch((error) => {
  //         return reject(
  //           message.issueMessage(
  //             message["500_SERVER_INTERNAL_ERROR"],
  //             "UNDEFINED_ERROR"
  //           )
  //         );
  //       });
  //   });
  // }

  findRoom(condition) {
    return new Promise((resolve, reject) => {
      models.room
        .findOne({
          where: condition,
          include: [
            {
              model: models.floor,
              attributes: ["floor_number"],
            },
          ],
          attributes: [
            "id",
            "name",
            "floor_id",
            "hotel_id",
            "price",
            "room_grade_id",
            "additional_service",
          ],
        })
        .then((response) => {
          if (!response) {
            // 방을 찾지 못한 경우
            resolve({ canCreate: true });
          } else {
            resolve({ canCreate: false, room: response });
          }
        })
        .catch((error) => {
          reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.room
        .findOne({
          where: condition,
          include: [
            {
              model: models.floor,
              attributes: ["floor_number"],
            },
          ],
          attributes: [
            "id",
            "name",
            "floor_id",
            "hotel_id",
            "price",
            "room_grade_id",
            "additional_service",
          ],
        })
        .then((response) => {
          if (!response) {
            return reject(
              message.issueMessage(message["404_NOT_FOUND"], "ROOM_NOT_FOUND")
            );
          } else {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.room = response;

            return resolve(obj);
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  update(room_id, name, floor_id) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: room_id,
      })
        .then((response) => {
          models.room
            .update(
              {
                name: name,
                floor_id: floor_id,
              },
              {
                where: {
                  id: room_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  // 호텔 방 등급 부여
  updateGrade(room_id, room_grade_id) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: room_id,
      })
        .then((response) => {
          models.room
            .update(
              {
                room_grade_id: room_grade_id,
              },
              {
                where: {
                  id: room_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"], response.dataValues);
            })
            .catch((error) => {
              return reject(
                console.log(error),
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          console.log;
          return reject(error);
        });
    });
  }

  updateAdditionalService(room_id, additional_service) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: room_id,
      })
        .then((response) => {
          models.room
            .update(
              {
                additional_service: additional_service,
              },
              {
                where: {
                  id: room_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                console.log(error),
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  // 호텔 방 금액 수정
  updatePrice(room_id, price) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: room_id,
      })
        .then((response) => {
          models.room
            .update(
              {
                price: price,
              },
              {
                where: {
                  id: room_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                console.log(error),
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  //호텔 방 부가서비스 건수 추가
  addService(room_id, additionalService) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: room_id,
      })
        .then((room) => {
          // additionalService를 숫자로 변환
          const additionalServiceNumber = Number(additionalService);
          // 변환에 실패한 경우 (NaN인 경우) 에러를 반환
          if (isNaN(additionalServiceNumber)) {
            return reject(new Error("Invalid additionalService: Not a number"));
          }
          const updatedadditionalService =
            room.room.additional_service + additionalServiceNumber;
          models.room
            .update(
              {
                additional_service: updatedadditionalService,
              },
              {
                where: {
                  id: room_id,
                },
              }
            )
            .then((response) => {
              console.log(response);
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                cosole.log(error),
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  // 호텔 방 금액 추가
  addPrice(room_id, additionalPrice) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: room_id })
        .then((room) => {
          // additionalPrice를 숫자로 변환
          const additionalPriceNumber = Number(additionalPrice);
          // 변환에 실패한 경우 (NaN인 경우) 에러를 반환
          if (isNaN(additionalPriceNumber)) {
            return reject(new Error("Invalid additionalPrice: Not a number"));
          }
          const updatedPrice = room.room.price + additionalPriceNumber;
          models.room
            .update({ price: updatedPrice }, { where: { id: room_id } })
            .then((response) => {
              console.log(response);
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                console.log(error),
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  minusPrice(room_id, additionalPrice) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: room_id })
        .then((room) => {
          const additionalPriceNumber = Number(additionalPrice);
          if (isNaN(additionalPriceNumber)) {
            return reject(new Error("Invalid additionalPrice: Not a number"));
          }
          const updatedPrice = room.room.price - additionalPriceNumber;
          models.room
            .update({ price: updatedPrice }, { where: { id: room_id } })
            .then((response) => {
              console.log(response);
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                console.log(error),
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  delete(room_id) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: room_id,
      })
        .then((response) => {
          models.room
            .destroy({
              where: {
                id: room_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  deletebyHotelID(hotel_id) {
    return new Promise((resolve, reject) => {
      models.room
        .destroy({
          where: {
            hotel_id: hotel_id,
          },
        })
        .then((response) => {
          return resolve(
            message["200_SUCCESS"],
            "hotel_id: " + hotel_id + " - ROOM DELETE SUCCESS"
          );
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
  }
}

class Requirement_Log extends Room {
  constructor() {
    super();
  }

  create(
    room_id,
    question,
    answer,
    department_name,
    summarized_sentence,
    identifier
  ) {
    return new Promise((resolve, reject) => {
      let reqresponse;
      let room_name, hotel_id, department_id;

      new Room()
        .addService(room_id, 1)
        .then((response) => {
          return new Room().readOne({ id: room_id });
        })
        .then((response) => {
          room_name = response.room.name;
          hotel_id = response.room.hotel_id;
          return new Department().readOne({
            token_name: department_name,
            hotel_id: hotel_id,
          });
        })
        .then((response) => {
          department_name = response.department.name;
          department_id = response.department.id;
          return models.requirement_log.create({
            type: "챗봇 요청사항",
            room_id: room_id,
            requirement_article: question,
            response_article: answer,
            progress: 0,
            process_department_id: department_id,
            summarized_sentence: summarized_sentence,
            hotel_id: hotel_id,
            user_id: null,
            identifier: identifier,
          });
        })
        .then((response) => {
          reqresponse = response;
          if (reqresponse) {
            // const requirementLogId = reqresponse.id;
            var worker = new Worker();
            return worker.readManyByDepartment(department_id);
          } else {
            throw message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            );
          }
        })
        .then((workers) => {
          console.log("\n\n\nWORKERS : ", workers);
          var sendTargetFCMTokens = [];

          for (var i = 0; i < workers["workers"].length; i++) {
            if (
              workers["workers"][i].work_logs.length > 0 &&
              workers["workers"][i].work_logs[0]["status"] == "WORK"
            ) {
              if (workers["workers"][i].fcm_token.length > 0) {
                sendTargetFCMTokens = sendTargetFCMTokens.concat(
                  workers["workers"][i].fcm_token
                );
              }
            }
          }

          if (sendTargetFCMTokens.length > 0) {
            console.log("FCMTOKENS!!!! : ", sendTargetFCMTokens);
            let _message = {
              notification: {
                title: "새로운 요청 도착!",
                body: "빠르게 요청을 배정받아주세요!",
              },
              data: {
                title: "새로운 요청 도착!",
                body: "빠르게 요청을 배정받아주세요!",
              },
              tokens: sendTargetFCMTokens,
              android: {
                priority: "high",
              },
              apns: {
                payload: {
                  aps: {
                    contentAvailable: true,
                  },
                },
              },
            };

            return admin.messaging().sendEachForMulticast(_message);
          } else {
            return Promise.resolve();
          }
        })
        .then((response) => {
          console.log("Successfully sent message: : ", response);

          var worker = new Worker();
          return worker.readMany(hotel_id);
        })
        .then((allWorkers) => {
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
                  "호에서 요청이 들어왔습니다: " +
                  summarized_sentence,
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
          return resolve({
            // return resolve(message["200_SUCCESS"]);
            status: message["200_SUCCESS"].status,
            requirement_log: reqresponse,
            result: response,
          });
        })
        .catch((error) => {
          console.log("\n\nERROR SENDING MESSAGE!!! : ", error);
          return resolve({
            // return resolve(message["200_SUCCESS"]);
            status: message["200_SUCCESS"].status,
            requirement_log: reqresponse,
            result: error,
          });
        });
    });
  }

  // create(room_id, question, answer, department_name, summarized_sentence) {
  //   return new Promise((resolve, reject) => {
  //     new Room().addService(room_id, 1).then((response) => {
  //       new Room()
  //         .readOne({
  //           id: room_id,
  //         })
  //         .then((response) => {
  //           var hotel_id = response.room.hotel_id;
  //           new Department()
  //             .readOne({
  //               token_name: department_name,
  //               hotel_id: hotel_id,
  //             })
  //             .then((response) => {
  //               var department_id = response.department.id;
  //               models.requirement_log
  //                 .create({
  //                   type: "챗봇 요청사항",
  //                   room_id: room_id,
  //                   requirement_article: question,
  //                   response_article: answer,
  //                   progress: 0,
  //                   process_department_id: department_id,
  //                   summarized_sentence: summarized_sentence,
  //                   hotel_id: hotel_id,
  //                   user_id: null,
  //                 })
  //                 .then((response) => {
  //                   if (response) {
  //                     var worker = new Worker();
  //                     worker
  //                       .readManyByDepartment2(department_id)
  //                       .then((workers) => {
  //                         var sendTargetFCMTokens = [];

  //                         for (var i = 0; i < workers["workers"].length; i++) {
  //                         if (
  //                           workers["workers"][i]["work_logs"].length > 0 &&
  //                           workers["workers"][i]["work_logs"][0]["status"] ==
  //                             "WORK"
  //                         ) {
  //                           if (
  //                             workers["workers"][i].dataValues["fcm_token"]
  //                               .length > 0
  //                           ) {
  //                             sendTargetFCMTokens = sendTargetFCMTokens.concat(
  //                               workers["workers"][i].dataValues["fcm_token"]
  //                             );
  //                           }
  //                         }

  //                         if (sendTargetFCMTokens.length > 0) {
  //                           let _message = {
  //                             notification: {
  //                               title: "새로운 요청 도착!",
  //                               body: "빠르게 요청을 배정받아주세요!",
  //                             },
  //                             data: {
  //                               title: "새로운 요청 도착!",
  //                               body: "빠르게 요청을 배정받아주세요!",
  //                             },
  //                             tokens: sendTargetFCMTokens,
  //                           };
  //                           admin
  //                             .messaging()
  //                             .sendMulticast(_message)
  //                             .then(function (response) {
  //                               console.log(
  //                                 "Successfully sent message: : ",
  //                                 response
  //                               );
  //                               return resolve(message["200_SUCCESS"]);
  //                             })
  //                             .catch(function (err) {
  //                               console.log("Error Sending message!!! : ", err);
  //                               return resolve(message["200_SUCCESS"]);
  //                             });
  //                         } else {
  //                           return resolve(message["200_SUCCESS"]);
  //                         }
  //                         .catch((error) => {
  //                         console.log(error);
  //                         if (
  //                           error.status &&
  //                           error.status == message["404_NOT_FOUND"].status
  //                         ) {
  //                           return resolve(message["200_SUCCESS"]);
  //                         } else {
  //                           return reject(error);
  //                         }
  //                       });
  //                   } else {
  //                     return reject(
  //                       message.issueMessage(
  //                         message["500_SERVER_INTERNAL_ERROR"],
  //                         "UNDEFINED_ERROR"
  //                       )
  //                     );
  //                   }
  //                 })})
  //                 .catch((error) => {
  //                   console.log(error);
  //                   return reject(
  //                     message.issueMessage(
  //                       message["500_SERVER_INTERNAL_ERROR"],
  //                       "UNDEFINED_ERROR"
  //                     )
  //                   );
  //                 });
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //               return reject(error);
  //             });
  //         })
  //         .catch((error) => {
  //           console.log(error);
  //           return reject(error);
  //         });
  //     });
  //   });
  // }

  createbymenu(room_id, department_name, menu, price, num) {
    return new Promise((resolve, reject) => {
      let reqresponse;
      const room = new Room();
      const department = new Department();
      room
        .readOne({
          id: room_id,
        })
        .then((response) => {
          var room_name = response.room.name;
          var hotel_id = response.room.hotel_id;
          department
            .readOne({
              token_name: department_name,
              hotel_id: hotel_id,
            })
            .then((response) => {
              var department_name = response.department.name;
              var department_id = response.department.id;
              var summarized_sentence = `${menu} ${num}개 주문`;
              console.log(response);
              models.requirement_log
                .create({
                  type: "메뉴판 요청사항",
                  room_id: room_id,
                  requirement_article: null,
                  response_article: null,
                  progress: 0,
                  process_department_id: department_id,
                  summarized_sentence: summarized_sentence,
                  hotel_id: hotel_id,
                  menu: menu,
                  price: price,
                  num: num,
                  user_id: null,
                })
                .then((response) => {
                  reqresponse = response;
                  if (reqresponse) {
                    var worker = new Worker();
                    worker
                      // .readManyByDepartment2(department_id)
                      .readManyByDepartment(department_id)
                      .then((workers) => {
                        console.log("\n\n\nreadManybyDepworkers2 : ", workers);
                        var sendTargetFCMTokens = [];

                        for (var i = 0; i < workers["workers"].length; i++) {
                          if (
                            // console.log("check1 : ", workers["workers"][i]),
                            workers["workers"][i].work_logs.length > 0 &&
                            workers["workers"][i].work_logs[0]["status"] ==
                              "WORK"
                          ) {
                            if (workers["workers"][i].fcm_token.length > 0) {
                              sendTargetFCMTokens = sendTargetFCMTokens.concat(
                                workers["workers"][i].fcm_token
                              );
                            }
                          }
                        }

                        if (sendTargetFCMTokens.length > 0) {
                          console.log("FCMTOKENS!!!! : ", sendTargetFCMTokens);
                          let _message = {
                            notification: {
                              title: "새로운 요청 도착!",
                              body: "빠르게 요청을 배정받아주세요!",
                            },
                            data: {
                              title: "새로운 요청 도착!",
                              body: "빠르게 요청을 배정받아주세요!",
                            },
                            tokens: sendTargetFCMTokens,
                            //
                            //android, apns 추가
                            android: {
                              priority: "high",
                            },
                            apns: {
                              payload: {
                                aps: {
                                  contentAvailable: true,
                                },
                              },
                            },
                          };
                          admin
                            .messaging()
                            // getMessaging()
                            .sendEachForMulticast(_message)
                            .then(function (response) {
                              console.log(
                                "Successfully sent message: : ",
                                response
                              );

                              // 두 번째 알림을 위해 웹용 fcm_token을 가진 직원들을 조회

                              worker
                                .readMany(hotel_id)
                                .then((allWorkers) => {
                                  var sendTargetFCMTokensWeb = [];

                                  for (
                                    var j = 0;
                                    j < allWorkers["workers"].length;
                                    j++
                                  ) {
                                    if (
                                      allWorkers["workers"][j].fcm_token_web &&
                                      allWorkers["workers"][j].fcm_token_web
                                        .length > 0
                                    ) {
                                      sendTargetFCMTokensWeb =
                                        sendTargetFCMTokensWeb.concat(
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
                                          "호에서 요청이 들어왔습니다: " +
                                          summarized_sentence,
                                      },
                                      // data: {
                                      //   title: "로즈골드",
                                      //   body:
                                      //     "[" +
                                      //     department_name +
                                      //     "] " +
                                      //     room_name +
                                      //     "호에서 요청이 들어왔습니다: " +
                                      //     summarized_sentence,
                                      // },
                                      tokens: sendTargetFCMTokensWeb,
                                    };

                                    admin
                                      .messaging()
                                      .sendEachForMulticast(_webMessage)
                                      .then(function (response) {
                                        console.log(
                                          "\n\nWEB MESSAGE SEND SUCCESS :",
                                          response
                                        );
                                        return resolve({
                                          // return resolve(message["200_SUCCESS"]);
                                          status: message["200_SUCCESS"].status,
                                          requirement_log: reqresponse,
                                          result: response,
                                        });
                                      })
                                      .catch(function (err) {
                                        console.log(
                                          "\n\nERROR SENDING WEB MESSAGE!!! : ",
                                          err
                                        );
                                        return resolve({
                                          // return resolve(message["200_SUCCESS"]);
                                          status: message["200_SUCCESS"].status,
                                          requirement_log: reqresponse,
                                          result: response,
                                        });
                                      });
                                  } else {
                                    console.log("NO WEB TOKENS");
                                    return resolve({
                                      // return resolve(message["200_SUCCESS"]);
                                      status: message["200_SUCCESS"].status,
                                      requirement_log: reqresponse,
                                      result: response,
                                    });
                                  }
                                })
                                .catch((error) => {
                                  console.log(error);
                                  return resolve({
                                    // return resolve(message["200_SUCCESS"]);
                                    status: message["200_SUCCESS"].status,
                                    requirement_log: reqresponse,
                                    result: error,
                                  });
                                });
                            })
                            .catch(function (err) {
                              console.log(
                                "\n\nERROR SENDING MESSAGE!!! : ",
                                err
                              );
                              return resolve({
                                // return resolve(message["200_SUCCESS"]);
                                status: message["200_SUCCESS"].status,
                                requirement_log: reqresponse,
                                result: err,
                              });
                            });
                        } else {
                          return resolve({
                            // return resolve(message["200_SUCCESS"]);
                            status: message["200_SUCCESS"].status,
                            requirement_log: reqresponse,
                            result: response,
                          });
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        if (
                          error.status &&
                          error.status == message["404_NOT_FOUND"].status
                        ) {
                          return resolve({
                            // return resolve(message["200_SUCCESS"]);
                            status: message["200_SUCCESS"].status,
                            requirement_log: reqresponse,
                            result: error,
                          });
                        } else {
                          return reject(error);
                        }
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
                  return reject(
                    message.issueMessage(
                      message["500_SERVER_INTERNAL_ERROR"],
                      "UNDEFINED_ERROR"
                    )
                  );
                });
            })
            .catch((error) => {
              console.log(error);
              return reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  createAdditionalService(room_id, summarized_sentence, price, pmsign) {
    return new Promise((resolve, reject) => {
      const room = new Room();
      room
        .readOne({ id: room_id })
        .then((response) => {
          var hotel_id = response.room.hotel_id;
          new Room()
            .addService(room_id, 1)
            .then(() => {
              let pricePromise;
              if (pmsign == "+") {
                pricePromise = new Room().addPrice(room_id, price);
              } else if (pmsign == "-") {
                pricePromise = new Room().minusPrice(room_id, price);
              } else {
                return reject(
                  message.issueMessage(
                    message["400_BAD_REQUEST"],
                    "INVALID pmsign: must be '+' or '-'"
                  )
                );
              }

              pricePromise.then(() => {
                // new Room().addPrice(room_id, price).then(() => {
                models.requirement_log
                  .create({
                    type: "부가서비스",
                    room_id: room_id,
                    summarized_sentence: summarized_sentence,
                    price: price,
                    num: 1,
                    pmsign: pmsign,
                    hotel_id: hotel_id,
                  })
                  .then((response) => {
                    return resolve(message["200_SUCCESS"]);
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
            })
            .catch((error) => {
              console.log(error);
              return reject(error);
            });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.requirement_log
        .findAll({
          where: condition,
          include: [
            {
              model: models.room,
              attributes: ["name"],
              // as: "room",
            },
            {
              model: models.department,
              attributes: ["name"],
            },
            // {
            //   model: models.user,
            //   attributes: ["name"],
            // },
          ],
          attributes: [
            "id",
            "type",
            "requirement_article",
            "response_article",
            "progress",
            "room_id",
            "hotel_id",
            "process_department_id",
            "requirement_id",
            "createdAt",
            "updatedAt",
            "user_id",
            "summarized_sentence",
            "processed_info",
            "pmsign",
            "identifier",
            "readcount",
          ],
          order: [["createdAt", "ASC"]],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.Total_requirement_log = response.length; // 총 로그 수 반환
            obj.requirement_log = response.map((log) => ({
              ...log.dataValues,
              // room_name: log.room ? log.room.dataValues.name : null,
            }));
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_LOG_NOT_FOUND"
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
        });
    });
  }

  readManyByDate(query) {
    return new Promise((resolve, reject) => {
      var createdAt = query.created_at;
      var hotelID = query.hotel_id;
      var condition = { hotel_id: hotelID };
      const startDate = createdAt + " 00:00:00";

      const endDate = createdAt + " 23:59:59";

      console.log(createdAt);

      condition["createdAt"] = {
        [models.Sequelize.Op.between]: [startDate, endDate],
      };
      console.log(`startDate: ${startDate}, endDate: ${endDate}`);

      models.requirement_log
        .findAll({
          where: condition,
          include: [
            {
              model: models.room,
              attributes: ["name"],
            },
            {
              model: models.department,
              attributes: ["name"],
            },
          ],
          attributes: [
            "id",
            "type",
            "requirement_article",
            "response_article",
            "progress",
            "room_id",
            "hotel_id",
            "process_department_id",
            "requirement_id",
            "createdAt",
            "user_id",
            "summarized_sentence",
            "identifier",
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.Total_requirement_log_bydate = response.length; // 총 로그 개수
            obj.requirement_log = response.map((log) => ({
              ...log.dataValues,
            }));
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_LOG_BY_DATE_NOT_FOUND"
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
        });
    });
  }

  readManyByRoom(condition) {
    return new Promise((resolve, reject) => {
      models.requirement_log
        .findAll({
          where: condition,
          include: [
            {
              model: models.room,
              attributes: ["name"],
            },
            {
              model: models.department,
              attributes: ["name"],
            },
          ],
          attributes: [
            "id",
            "type",
            "requirement_article",
            "response_article",
            "progress",
            "room_id",
            "hotel_id",
            "process_department_id",
            "requirement_id",
            "createdAt",
            "user_id",
            "summarized_sentence",
            "identifier",
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.Total_requirement_log_byroom = response.length; // 총 로그 개수
            obj.requirement_log = response.map((log) => ({
              ...log.dataValues,
            }));
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_LOG_BY_ROOM_ID_NOT_FOUND"
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
        });
    });
  }

  readManyMenuPriceNum(condition) {
    return new Promise((resolve, reject) => {
      models.requirement_log
        .findAll({
          where: condition,
          include: [
            {
              model: models.room,
              attributes: ["name"],
              // as: "room",
            },
          ],
          attributes: [
            "id",
            "type",
            "room_id",
            "menu",
            "price",
            "num",
            "pmsign",
            "summarized_sentence",
            "createdAt",
            "identifier",
          ],
          order: [["createdAt", "ASC"]],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.Total_requirement_log = response.length; // 총 로그 수 반환
            obj.requirement_log = response.map((log) => ({
              ...log.dataValues,
              // room_name: log.room ? log.room.dataValues.name : null,
            }));
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_LOG_NOT_FOUND"
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
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.requirement_log
        .findOne({
          where: condition,
        })
        .then((response) => {
          if (response) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.requirement_log = response.dataValues;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_LOG_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  update(requirement_log_id, progress) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: requirement_log_id,
      })
        .then((response) => {
          models.requirement_log
            .update(
              {
                progress: progress,
              },
              {
                where: {
                  id: requirement_log_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateDepartment(requirement_log_id, process_department_id) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: requirement_log_id,
      })
        .then((response) => {
          models.requirement_log
            .update(
              {
                process_department_id: process_department_id,
              },
              {
                where: {
                  id: requirement_log_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateWorker(requirement_log_id, user_id) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: requirement_log_id,
      })
        .then((response) => {
          models.requirement_log
            .update(
              {
                user_id: user_id,
              },
              {
                where: {
                  id: requirement_log_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateProcessedInfo(requirement_log_id, processed_info) {
    return new Promise((resolve, reject) => {
      console.log(requirement_log_id);
      models.requirement_log
        .update(
          {
            progress: 2,
            processed_info: processed_info,
          },
          {
            where: {
              id: requirement_log_id,
              progress: 1,
            },
          }
        )
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }

  updateReadCount(requirement_log_id) {
    return new Promise((resolve, reject) => {
      this.readOne({ id: requirement_log_id })
        .then((response) => {
          models.requirement_log
            .update(
              {
                readcount: 1,
              },
              {
                where: {
                  id: requirement_log_id,
                },
              }
            )
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  updateidentifier(identifier, requirement_log_id) {
    return new Promise((resolve, reject) => {
      models.requirement_log
        .update(
          {
            identifier: identifier,
          },
          {
            where: {
              id: requirement_log_id,
            },
          }
        )
        .then((response) => {
          if (response[0] > 0) {
            return resolve(message["200_SUCCESS"]);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "REQUIREMENT_LOG_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }

  delete(requirement_log_id) {
    return new Promise((resolve, reject) =>
      this.readOne({ id: requirement_log_id })
        .then((respone) => {
          models.requirement_log
            .destroy({
              where: {
                id: requirement_log_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(
                message.issueMessage(
                  message["500_SERVER_INTERNAL_ERROR"],
                  "UNDEFINED_ERROR"
                )
              );
            });
        })
        .catch((error) => {
          return reject(error);
        })
    );
  }

  deletebyRoomID(room_id) {
    return new Promise((resolve, reject) =>
      models.requirement_log
        .destroy({
          where: {
            room_id: room_id,
          },
        })
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        })
    );
  }

  deletebyHotelID(hotel_id) {
    return new Promise((resolve, reject) => {
      models.requirement_log
        .destroy({
          where: {
            hotel_id: hotel_id,
          },
        })
        .then((response) => {
          return resolve(
            message["200_SUCCESS"] +
              ", hotel_id : " +
              hotel_id +
              "에 해당하는 모든 요청사항 삭제 완료"
          );
        })
        .catch((error) => {
          return reject(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
        });
    });
  }
}

class Message {
  sendMessage(to_user_id, message_article, user_id) {
    return new Promise((resolve, reject) => {
      var worker = new Worker();

      worker
        .readOne({
          id: to_user_id,
        })
        .then((workerInfoResponse) => {
          models.message
            .create({
              to_user_id: to_user_id,
              message_article: message_article,
              user_id: user_id,
            })
            .then((response) => {
              var token = workerInfoResponse.dataValues["fcm_token"];

              if (sendTargetFCMTokens.length > 0) {
                let _message = {
                  notification: {
                    title: "새로운 알림 도착!",
                    body: "알림을 확인해주세요",
                  },
                  data: {
                    title: "새로운 알림 도착!",
                    body: "알림을 확인해주세요",
                  },
                  tokens: token,
                  android: {
                    priority: "high",
                  },
                  apns: {
                    payload: {
                      aps: {
                        contentAvailable: true,
                      },
                    },
                  },
                };
                admin
                  .messaging()
                  .sendMulticast(_message)
                  .then(function (response) {
                    console.log("Successfully sent message: : ", response);
                    return resolve(message["200_SUCCESS"]);
                  })
                  .catch(function (err) {
                    console.log("Error Sending message!!! : ", err);
                    return resolve(message["200_SUCCESS"]);
                  });
              } else {
                return resolve(message["200_SUCCESS"]);
              }
              return resolve(message["200_SUCCESS"]);
            })
            .catch((error) => {
              return reject(message["500_SERVER_INTERNAL_ERROR"]);
            });
        })
        .catch((error) => {
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.message
        .findAll({
          include: [{ model: models.user }],
          where: condition,
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.messages = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "MESSAGE_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }

  update(message_id, status) {
    return new Promise((resolve, reject) => {
      models.message
        .update(
          {
            status: status,
          },
          {
            where: {
              id: message_id,
            },
          }
        )
        .then((response) => {
          return resolve(message["200_SUCCESS"]);
        })
        .catch((error) => {
          return reject(message["500_SERVER_INTERNAL_ERROR"]);
        });
    });
  }
}

module.exports = {
  Hotel,
  Department,
  Role,
  Worker,
  Role_Assign_Log,
  Room,
  Requirement_Log,
  Message,
};

// readManyByDepartment2 response - worker
// workers: [
//   user {
//     dataValues: [Object],
//     _previousDataValues: [Object],
//     uniqno: 1,
//     _changed: Set(0) {},
//     _options: [Object],
//     isNewRecord: false,
//     role_assign_log: null,
//     work_logs: []
//   },
//   user {
//     dataValues: [Object],
//     _previousDataValues: [Object],
//     uniqno: 1,
//     _changed: Set(0) {},
//     _options: [Object],
//     isNewRecord: false,
//     role_assign_log: [role_assign_log],
//     work_logs: []
//   },

// readManyByDeparment response - worker

// workers: [
//   {
//     id: 30,
//     name: '김휘성',
//     user_num: '004',
//     user_id: '12345',
//     user_pwd: '1123',
//     phone: '010-5050-5050',
//     hotel_admin_user: true,
//     fcm_token: {},
//     createdAt: 2024-06-30T10:01:22.000Z,
//     updatedAt: 2024-07-28T16:22:48.000Z,
//     deletedAt: null,
//     hotel_id: 1,
//     work_logs: [],
//     role_id: 73,
//     role_name: '사원',
//     department_id: 2,
//     department_name: 'F&B팀'
//   },
//   {
//     id: 35,
//     name: '서민정',
//     user_num: '011',
//     user_id: '1231',
//     user_pwd: '1231',
//     phone: '010-2020-3030',
//     hotel_admin_user: false,
//     fcm_token: {},
//     createdAt: 2024-07-02T11:32:26.000Z,
//     updatedAt: 2024-07-28T08:34:46.000Z,
//     deletedAt: null,
//     hotel_id: 1,
//     work_logs: [],
//     role_id: 72,
//     role_name: '팀장',
//     department_id: 2,
//     department_name: 'F&B팀'
//   }
