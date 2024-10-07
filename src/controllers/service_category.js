const message = require("../../config/message");
const Hotel = require("../models/hotel").Hotel;
const Service = require("../models/service").Service;
const Service_Category = require("../models/service_category").Service_Category;

function createService_Category(req, res) {
  if (
    req.body.name == null ||
    req.body.eng_name == null ||
    req.body.hotel_id == null ||
    req.body.department_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const service_category = new Service_Category();
  service_category
    .create(
      req.body.name,
      req.body.eng_name,
      req.body.hotel_id,
      req.body.department_id
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

function createService_Category_Array(req, res) {
  const { service_cate_array } = req.body;

  if (!Array.isArray(service_cate_array) || service_cate_array.length === 0) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_ARRAY"));
  }

  const promises = service_cate_array.map((service_cates) => {
    const { name, eng_name, hotel_id, department_id } = service_cates;

    if (
      name == null ||
      eng_name == null ||
      hotel_id == null ||
      department_id == null
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

    const service_category = new Service_Category();
    service_category.create(name, eng_name, hotel_id, department_id);
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

function getService_CategoryMany(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const service_category = new Service_Category();
  const hotel = new Hotel();

  hotel
    .readOne({ id: req.query.hotel_id })
    .then((response) => {
      service_category
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

function getService_CategoryOne(req, res) {
  if (req.query.department_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const service_category = new Service_Category();
  service_category
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

function deleteService_Category(req, res) {
  if (req.query.service_category_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const service_category = new Service_Category();
  service_category
    .delete(req.query.service_category_id)
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
  createService_Category,
  createService_Category_Array,
  getService_CategoryMany,
  getService_CategoryOne,
  deleteService_Category,
};
