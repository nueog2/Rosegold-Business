const jwt = require("../modules/jwt");
const message = require("../../config/message");
const Hotel = require("../models/hotel").Hotel;
const Department = require("../models/hotel").Department;
const Role = require("../models/hotel").Role;
const Worker = require("../models/hotel").Worker;
const Requirement_Category =
  require("../models/requirement_category").Requirement_Category;
const Requirement = require("../models/requirement").Requirement;
const upload = require("../modules/multer");

function createRequirement(req, res) {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  if (
    req.body.name == null ||
    req.body.able_start_time == null ||
    req.body.able_end_time == null ||
    req.body.price == null ||
    req.file == null ||
    req.body.description == null ||
    req.body.requirement_category_id == null
  ) {
    console.log("Missing parameters");
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement = new Requirement();
  const domain = "http://223.130.137.39:6060"; // 도메인 주소 추가
  const filePath = req.file.path.replace(/\\/g, "/"); // 경로에서 백슬래시를 슬래시로 변경
  const thumbnail_image_url = `${domain}/${filePath}`;

  requirement
    .create(
      req.body.name,
      req.body.able_start_time,
      req.body.able_end_time,
      req.body.price,
      thumbnail_image_url,
      req.body.description,
      req.body.requirement_category_id
    )
    .then((response) => {
      console.log("Requirement created successfully:", response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log("Error creating requirement:", error);
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

function getRequirementMany(req, res) {
  const requirement = new Requirement();
  requirement
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

function getRequirementManyByRequirementCategoryID(req, res) {
  if (req.query.requirement_category_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement = new Requirement();
  const requirement_category = new Requirement_Category();

  requirement_category
    .readOne({ id: req.query.requirement_category_id })
    .then((response) => {
      requirement
        .readMany({
          requirement_category_id: req.query.requirement_category_id,
        })
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

function getRequirementOne(req, res) {
  if (req.query.requirement_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement = new Requirement();
  requirement
    .readOne({ id: req.query.requirement_id })
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

function updateRequirement(req, res) {
  if (
    req.body.name == null ||
    req.body.able_start_time == null ||
    req.body.able_end_time == null ||
    req.body.price == null ||
    //req.file == null ||
    req.body.description == null ||
    req.body.requirement_category_id == null ||
    (req.file == null && req.body.thumbnail_image_url == null)
  ) {
    console.log("Missing parameters");
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement = new Requirement();
  let thumbnail_image_url;

  if (req.file) {
    const domain = "http://223.130.137.39:6060"; // 도메인 주소 추가
    const filePath = req.file.path.replace(/\\/g, "/"); // 경로에서 백슬래시를 슬래시로 변경
    thumbnail_image_url = `${domain}/${filePath}`;
  } else {
    thumbnail_image_url = req.body.thumbnail_image_url;
  }

  requirement
    .update(
      req.body.requirement_id,
      req.body.name,
      req.body.able_start_time,
      req.body.able_end_time,
      req.body.price,
      thumbnail_image_url,
      req.body.description,
      req.body.requirement_category_id
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

function deleteRequirement(req, res) {
  if (req.body.requirement_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement = new Requirement();
  requirement
    .delete(req.body.requirement_id)
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
  createRequirement,
  getRequirementMany,
  getRequirementManyByRequirementCategoryID,
  getRequirementOne,
  updateRequirement,
  deleteRequirement,
};
