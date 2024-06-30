const jwt = require("../modules/jwt");
const message = require("../../config/message");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Requirement_Category =
  require("../models/requirement_category").Requirement_Category;

function createRequirement_Category(req, res) {
  const { req_cate_array } = req.body;

  if (!Array.isArray(req_cate_array) || req_cate_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = req_cate_array.map((req_cates) => {
    const { name, hotel_id } = req_cates;

    if (name == null || hotel_id == null) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const requirement_category = new Requirement_Category();
    requirement_category.create(name, hotel_id);
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

  // .then((response) => {
  //   return res.status(response.status).send(response);
  // })
  // .catch((error) => {
  //   console.log(error);
  //   if (!error.status)
  //     return res
  //       .status(message["500_SERVER_INTERNAL_ERROR"].status)
  //       .send(
  //         message.issueMessage(
  //           message["500_SERVER_INTERNAL_ERROR"],
  //           "UNDEFINED_ERROR"
  //         )
  //       );
  //   else return res.status(error.status).send(error);
  // });

  // if (req.body.name == null) {
  //   return res
  //     .status(message["400_BAD_REQUEST"].status)
  //     .send(
  //       message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
  //     );
  // }

  // const requirement_category = new Requirement_Category();
  // requirement_category
  //   .create(req.body.name, req.body.hotel_id)
  //   .then((response) => {
  //     return res.status(response.status).send(response);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     if (!error.status)
  //       return res
  //         .status(message["500_SERVER_INTERNAL_ERROR"].status)
  //         .send(
  //           message.issueMessage(
  //             message["500_SERVER_INTERNAL_ERROR"],
  //             "UNDEFINED_ERROR"
  //           )
  //         );
  //     else return res.status(error.status).send(error);
  //   });
}

function getRequirement_CategoryMany(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_category = new Requirement_Category();
  const hotel = new Hotel();

  hotel
    .readOne({ id: req.query.hotel_id })
    .then((response) => {
      requirement_category
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

function getRequirement_CategoryOne(req, res) {
  if (req.query.requirement_category_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_category = new Requirement_Category();
  requirement_category
    .readOne({ id: req.query.requirement_category_id })
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

function updateRequirement_Category(req, res) {
  const { req_cate_array } = req.body;

  if (!Array.isArray(req_cate_array) || req_cate_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = req_cate_array.map((req_cates) => {
    const { requirement_category_id, name } = req_cates;

    if (requirement_category_id == null || name == null) {
      return res
        .status(message["400_BAD_REQUEST"].status)
        .send(
          message.issueMessage(
            message["400_BAD_REQUEST"],
            "SEND_ALL_PARAMETERS"
          )
        );
    }

    const requirement_category = new Requirement_Category();
    requirement_category.update(requirement_category_id, name);
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
//   if (!error.status)
//     return res
//       .status(message["500_SERVER_INTERNAL_ERROR"].status)
//       .send(
//         message.issueMessage(
//           message["500_SERVER_INTERNAL_ERROR"],
//           "UNDEFINED_ERROR"
//         )
//       );
//   else return res.status(error.status).send(error);
// });

//   if (req.body.name == null) {
//     return res
//       .status(message["400_BAD_REQUEST"].status)
//       .send(
//         message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
//       );
//   }

//   const requirement_category = new Requirement_Category();
//   requirement_category
//     .update(req.body.requirement_category_id, req.body.name)
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
// }

function deleteRequirement_Category(req, res) {
  if (req.body.requirement_category_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement_category = new Requirement_Category();
  requirement_category
    .delete(req.body.requirement_category_id)
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

module.exports = {
  createRequirement_Category,
  getRequirement_CategoryMany,
  getRequirement_CategoryOne,
  updateRequirement_Category,
  deleteRequirement_Category,
};
