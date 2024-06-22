// const message = require("../../config/message");
// const Hotel = require("../models/hotel").Hotel;
// const Service = require("../models/service").Service;

// function createService_Category(req,res) {
//     if (req.body.name == null ||
//         req.body.hotel_id == null ||
//         req.body.department_id == null) {
//             return res
//                 .status(message["400_BAD_REQUEST"].status)
//                 .send(
//                     message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//                 );
//             }

//     const service_category = new Service_Category();
//     service_category
//         .create(req.body.name, req.body.hotel_id, req.body.department_id)
//         .then((response) => {
//             return res.status(response.status).send(response);
//         })
//         .catch((error) => {
//             console.log(error);
//             if (!error.status)
//                 return res
//                     .status(message["500_SERVER_INTERNAL_ERROR"].status)
//                     .send(
//                         message.issueMessage(
//                             message["500_SERVER_INTERNAL_ERROR"],
//                             "UNDEFINED_ERROR"
//                         )
//                     );
//             else return res.status(error.status).send(error);
//         });
// }

// function getService_CategoryMany(req,res) {
//     if (req.query.hotel_id == null) {
//         return res
//             .status(message["400_BAD_REQUEST"].status)
//             .send(
//                 message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//             );
//     }

//     const service_category = new Service_Category();
//     const hotel = new Hotel();

//     hotel
//         .readOne({ id: req.query.hotel_id })
//         .then((response) => {
//             service_category
//                 .readMany({ hotel_id: req.query.hotel_id })
//                 .then((response) => {
//                     return res.status(response.status).send(response);
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                     if (!error.status)
//                         return res
//                             .status(message["500_SERVER_INTERNAL_ERROR"].status)
//                             .send(
//                                 message.issueMessage(
//                                     message["500_SERVER_INTERNAL_ERROR"],
//                                     "UNDEFINED_ERROR"
//                                 )
//                             );
//                     else return res.status(error.status).send(error);
//                 });
//         })
//         .catch((error) => {
//             console.log(error);
//             if (!error.status)
//                 return res
//                     .status(message["500_SERVER_INTERNAL_ERROR"].status)
//                     .send(
//                         message.issueMessage(
//                             message["500_SERVER_INTERNAL_ERROR"],
//                             "UNDEFINED_ERROR"
//                         )
//                     );
//             else return res.status(error.status).send(error);
//         });
// }
