// const models = require("../../models");
// const message = require("../../config/message");
// const { Hotel } = require("./hotel");
// const { Room } = require("./hotel");

// class Requirement_Log extends Room {
//     constructor() {
//       super();
//     }

//     create(
//       type,
//       requirement_article,
//       response_article,
//       room_id,
//       hotel_id,
//       process_department_id,
//       requirement_id
//     ) {
//       return new Promise((resolve, reject) => {
//         super.readOne(hotel_id).then((response) => {
//           models.requirement_log
//             .create({
//               type: type,
//               requirement_article: requirement_article,
//               response_article: response_article,
//               room_id: room_id,
//               hotel_id: hotel_id,
//               process_department_id: process_department_id,
//               requirement_id: requirement_id,
//             })
//             .then((response) => {
//               if (response) {
//                 return resolve(message["200_SUCCESS"]);
//               } else {
//                 return reject(
//                   message.issueMessage(
//                     message["500_SERVER_INTERNAL_ERROR"],
//                     "UNDEFINED_ERROR"
//                   )
//                 );
//               }
//             })
//             .catch((error) => {
//               console.log(error);
//               return reject(error);
//             });
//         });
//       });
//     }

//     readMany(condition) {
//       return new Promise((resolve, reject) => {
//         models.requirement_log
//           .findAll({
//             where: condition,
//             attributes: [
//               "id",
//               "type",
//               "requirement_article",
//               "response_article",
//               "room_id",
//               "hotel_id",
//               "process_department_id",
//               "requirement_id",
//             ],
//           })
//           .then((response) => {
//             if (response.length > 0) {
//               var obj = Object.assign({}, message["200_SUCCESS"]);
//               obj.requirement_log = response;
//               return resolve(obj);
//             } else {
//               return reject(
//                 message.issueMessage(
//                   message["404_NOT_FOUND"],
//                   "REQUIREMENT_LOG_NOT_FOUND"
//                 )
//               );
//             }
//           })
//           .catch((error) => {
//             console.log(error);
//             return reject(
//               message.issueMessage(
//                 message["500_SERVER_INTERNAL_ERROR"],
//                 "UNDEFINED_ERROR"
//               )
//             );
//           });
//       });
//     }

//     readOne(condition) {
//       return new Promise((resolve, reject) => {
//         models.requirement_log
//           .findOne({
//             where: condition,
//           })
//           .then((response) => {
//             if (response) {
//               var obj = Object.assign({}, message["200_SUCCESS"]);
//               obj.requirement_log = response.dataValues;
//               return resolve(obj);
//             } else {
//               return reject(
//                 message.issueMessage(
//                   message["404_NOT_FOUND"],
//                   "REQUIREMENT_LOG_NOT_FOUND"
//                 )
//               );
//             }
//           })
//           .catch((error) => {
//             return reject(
//               message.issueMessage(
//                 message["500_SERVER_INTERNAL_ERROR"],
//                 "UNDEFINED_ERROR"
//               )
//             );
//           });
//       });
//     }

//     update(requirement_log_id, progress) {
//       return new Promise((resolve, reject) => {
//         this.readOne({
//           id: requirement_log_id,
//         })
//           .then((response) => {
//             models.requirement_log
//               .update(
//                 {
//                   progress: progress,
//                 },
//                 {
//                   where: {
//                     id: requirement_log_id,
//                   },
//                 }
//               )
//               .then((response) => {
//                 return resolve(message["200_SUCCESS"]);
//               })
//               .catch((error) => {
//                 return reject(
//                   message.issueMessage(
//                     message["500_SERVER_INTERNAL_ERROR"],
//                     "UNDEFINED_ERROR"
//                   )
//                 );
//               });
//           })
//           .catch((error) => {
//             return reject(error);
//           });
//       });
//     }

//     delete(requirement_log_id) {
//       return new Promise((resolve, reject) =>
//         this.readOne({ id: requirement_log_id })
//           .then((respone) => {
//             models.requirement_log
//               .destroy({
//                 where: {
//                   id: requirement_log_id,
//                 },
//               })
//               .then((response) => {
//                 return resolve(message["200_SUCCESS"]);
//               })
//               .catch((error) => {
//                 return reject(
//                   message.issueMessage(
//                     message["500_SERVER_INTERNAL_ERROR"],
//                     "UNDEFINED_ERROR"
//                   )
//                 );
//               });
//           })
//           .catch((error) => {
//             return reject(error);
//           })
//       );
//     }
//   }
