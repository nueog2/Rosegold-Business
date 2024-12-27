const models = require("../../models");
const message = require("../../config/message");
const { Room } = require("./hotel");
const Room_Grade = require("../models/room_grade").Room_Grade;

class Storage {
  constructor() {}

  create(
    number,
    hotel_id,
    room_id,
    checkin_status,
    is_booked,
    is_paid,
    guest_name,
    guest_num,
    has_key,
    price,
    memo
  ) {
    return new Promise((resolve, reject) => {
      models.storage
        .create({
          number: number,
          hotel_id: hotel_id,
          room_id: room_id,
          checkin_status: checkin_status,
          is_booked: is_booked,
          is_paid: is_paid,
          guest_name: guest_name,
          guest_num: guest_num,
          has_key: has_key,
          price: price,
          memo: memo,
        })
        .then((response) => {
          if (response) {
            return resolve({
              status: message["200_SUCCESS"].status,
              storage: response,
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
      models.storage
        .findAll({
          where: condition,
          include: [
            {
              model: models.room,
              attributes: ["name", "room_grade_id"],
              required: false,
            },
          ],
        })
        .then((storages) => {
          if (storages.length === 0) {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "STORAGE_NOT_FOUND"
              )
            );
          }

          const storagePromises = storages.map((storage) => {
            const roomGradeId = storage.room
              ? storage.room.room_grade_id
              : null;

            const roomGradePromise = roomGradeId
              ? models.room_grade.findOne({
                  where: { id: roomGradeId },
                  // attributes: ["price_multiplier", "name"],
                  attributes: ["name"],
                })
              : Promise.resolve(null);

            return roomGradePromise.then((roomGrade) => {
              // storage.dataValues.price_multiplier = roomGrade
              //   ? roomGrade.price_multiplier
              //   : 0;
              storage.dataValues.grade_name = roomGrade ? roomGrade.name : "";

              storage.dataValues.room_name = storage.room
                ? storage.room.name
                : "";

              return storage;
            });
          });

          return Promise.all(storagePromises);
        })
        .then((updatedStorages) => {
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.storages = updatedStorages;
          return resolve(obj);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.storage
        .findOne({
          where: condition,
          include: [
            {
              model: models.room,
              attributes: ["name", "room_grade_id"],
              required: false,
            },
          ],
        })
        .then((storage) => {
          if (!storage) {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "STORAGE_NOT_FOUND"
              )
            );
          }

          const roomGradeId = storage.room ? storage.room.room_grade_id : null;

          const roomGradePromise = roomGradeId
            ? models.room_grade.findOne({
                where: { id: roomGradeId },
                // attributes: ["price_multiplier", "name"],
                attributes: ["name"],
              })
            : Promise.resolve(null);

          return roomGradePromise.then((roomGrade) => {
            // storage.dataValues.price_multiplier = roomGrade
            //   ? roomGrade.price_multiplier
            //   : 0;
            storage.dataValues.grade_name = roomGrade ? roomGrade.name : "";

            storage.dataValues.room_name = storage.room
              ? storage.room.name
              : "";

            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.storage = storage.dataValues;
            return resolve(obj);
          });
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readByRoomName(room_name, hotel_id) {
    return new Promise((resolve, reject) => {
      // models.room_grade.readOne()
      models.storage
        .findAll({
          include: [
            {
              model: models.room,
              where: { name: room_name },
              attributes: ["name", "room_grade_id"],
            },
          ],
          where: {
            hotel_id: hotel_id,
          },
        })
        .then((storages) => {
          if (storages.length === 0) {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "STORAGE_NOT_FOUND"
              )
            );
          }

          const storagePromises = storages.map((storage) => {
            const roomGradeId = storage.room.room_grade_id;

            const roomGradePromise = roomGradeId
              ? models.room_grade.findOne({
                  where: { id: roomGradeId },
                  // attributes: ["price_multiplier", "name"],
                  attributes: ["name"],
                })
              : Promise.resolve(null);

            return roomGradePromise.then((roomGrade) => {
              // storage.dataValues.price_multiplier = roomGrade
              //   ? roomGrade.price_multiplier
              //   : 0;
              storage.dataValues.grade_name = roomGrade ? roomGrade.name : "";
              return storage;
            });
          });

          return Promise.all(storagePromises);
        })
        .then((updatedStorages) => {
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.storages = updatedStorages;
          return resolve(obj);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  updateStorage(
    storage_id,
    number,
    room_id,
    checkin_status,
    is_booked,
    is_paid,
    guest_name,
    guest_num,
    has_key,
    price,
    memo
  ) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: storage_id,
      }).then((response) => {
        models.storage
          .update(
            {
              number: number,
              room_id: room_id,
              checkin_status: checkin_status,
              is_booked: is_booked,
              is_paid: is_paid,
              guest_name: guest_name,
              guest_num: guest_num,
              has_key: has_key,
              price: price,
              memo: memo,
            },
            {
              where: {
                id: storage_id,
              },
            }
          )
          .then((response) => {
            return resolve(message["200_SUCCESS"], response);
          })
          .catch((error) => {
            console.log(error);
            return reject(error);
          });
      });
    });
  }

  updateStorageEquipment(storage_id, memo) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: storage_id,
      }).then((response) => {
        models.storage
          .update(
            {
              memo: memo,
            },
            {
              where: {
                id: storage_id,
              },
            }
          )
          .then((response) => {
            return resolve(message["200_SUCCESS"], response);
          })
          .catch((error) => {
            console.log(error);
            return reject(error);
          });
      });
    });
  }

  cleardataStoragebyID(
    storage_id
    // number,
    // checkin_status,
    // is_booked,
    // is_paid,
    // guest_name,
    // has_key
  ) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: storage_id,
      }).then((response) => {
        models.storage
          .update(
            {
              //   number: number,
              checkin_status: 0,
              is_booked: 0,
              is_paid: 0,
              guest_name: null,
              guest_num: null,
              has_key: 1,
              room_id: null,
              price: 0,
              memo: null,
            },
            {
              where: {
                id: storage_id,
              },
            }
          )
          .then((response) => {
            return resolve(message["200_SUCCESS"], response.dataValues);
          })
          .catch((error) => {
            console.log(error);
            return reject(error);
          });
      });
    });
  }

  cleardataStoragebyhotelID(hotel_id) {
    return new Promise((resolve, reject) => {
      models.storage
        .update(
          {
            //   number: number,
            checkin_status: 0,
            is_booked: 0,
            is_paid: 0,
            guest_name: null,
            guest_num: null,
            has_key: 1,
            room_id: null,
            price: 0,
            memo: null,
          },
          {
            where: {
              hotel_id: hotel_id,
              checkin_status: 1,
            },
          }
        )
        .then((response) => {
          return resolve(message["200_SUCCESS"], response.dataValues);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  delete(storage_id) {
    return new Promise((resolve, reject) => {
      this.readOne({
        id: storage_id,
      })
        .then((response) => {
          models.storage
            .destroy({
              where: {
                id: storage_id,
              },
            })
            .then((response) => {
              return resolve(message["200_SUCCESS"]);
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

  // deletebyID
}

module.exports = { Storage };
