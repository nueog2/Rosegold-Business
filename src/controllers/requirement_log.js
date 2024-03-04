const Requirement_Log = require("../models/hotel").Requirement_Log;
const message = require("../../config/message");

function createRequirementLog(req, res) {
  if (
    req.body.type == null ||
    req.body.requirement_article == null ||
    req.body.response_article == null ||
    req.body.room_id == null ||
    req.body.hotel_id == null ||
    req.body.process_department_id == null ||
    req.body.requirement_id == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement_log = new Requirement_Log();
  requirement_log
    .create(
      req.body.type,
      req.body.requirement_article,
      req.body.response_article,
      req.body.room_id,
      req.body.hotel_id,
      req.body.process_department_id,
      req.body.requirement_id
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

function getRequirementLogMany(req, res) {
  const requirement_log = new Requirement_Log();
  requirement_log
    .readMany(req.query)
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

function getRequirementLogOne(req, res) {
  if (req.query.requirement_log_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .readOne({ id: req.query.requirement_log_id })
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

function updateRequirementLog(req, res) {
  if (req.body.requirement_log_id == null || req.body.progress == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const requirement_log = new Requirement_Log();
  requirement_log
    .update(req.body.requirement_log_id, req.body.progress)
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

function deleteRequirementLog(req, res) {
  if (req.query.requirement_log_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const requirement_log = new Requirement_Log();
  requirement_log
    .delete(req.query.requirement_log_id)
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
  createRequirementLog,
  getRequirementLogMany,
  getRequirementLogOne,
  updateRequirementLog,
  deleteRequirementLog,
};
