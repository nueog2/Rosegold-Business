// const models = require("../../models");
// const message = require("../../config/message");

// class RoomGrade {
//     constructor() {
//         super();
//       }

//     create(hotel_id, name, max_occupancy, price_multiplier) {
//         return new Promise((resolve, reject) => {
//             models.room_grade
//                 .create({
//                     hotel_id: hotel_id,
//                     name: name,
//                     max_occupancy: max_occupancy,
//                     price_multiplier: price_multiplier
//                 })
//                 .then((response) => {
//                     resolve(response, message["200_SUCCESS"]);
//                 })
//                 .catch((error) => {
//                     reject(error);
//                 });
// }
