const models = require("../../models");
const Room_Grade = require("../models/room_grade").Room_Grade;
const Hotel = require("../models/hotel").Hotel;
const message = require("../../config/message");

function createRoomGrade(req, res) {
  if (
    req.body.hotel_id == null ||
    req.body.name == null ||
    req.body.max_occupancy == null ||
    req.body.price_multiplier == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const room_grade = new Room_Grade();
  room_grade
    .create(
      req.body.hotel_id,
      req.body.name,
      req.body.max_occupancy,
      req.body.price_multiplier
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

function updateRoomGrade(req, res) {
  if (
    req.body.id == null ||
    req.body.hotel_id == null ||
    req.body.name == null ||
    req.body.max_occupancy == null ||
    req.body.price_multiplier == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const room_grade = new Room_Grade();
  room_grade
    .update(
      req.body.id,
      req.body.hotel_id,
      req.body.name,
      req.body.max_occupancy,
      req.body.price_multiplier
    )
    .then((response) => {
      res.status(response.status).send(response);
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

function getRoomGradeMany(req, res) {
  const room_grade = new Room_Grade();
  room_grade
    .readMany()
    .then((response) => {
      res.status(response.status).send(response);
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

function getRoomGradeOne(req, res) {
  if (req.query.room_grade_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }
  const room_grade = new Room_Grade();
  room_grade
    .readOne({ id: req.query.room_grade_id })
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status)
        return res
          .status(message["404_NOT_FOUND"].status)
          .send(
            message.issueMessage(
              message["404_NOT_FOUND"],
              "ROOM_GRADE_NOT_FOUND"
            )
          );
      else return res.status(error.status).send(error);
    });
}

function deleteRoomGrade(req, res) {
  if (req.body.room_grade_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const room_grade = new Room_Grade();
  room_grade
    .delete(req.body.room_grade_id)
    .then((response) => {
      res.status(response.status).send(response);
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
  createRoomGrade,
  updateRoomGrade,
  getRoomGradeMany,
  getRoomGradeOne,
  deleteRoomGrade,
};
