const message = require("../../config/message");
const models = require("../../models");
const { Storage } = require("../models/moonlight_storage");

function createStorage(req, res) {
  if (
    req.body.number == null ||
    req.body.hotel_id == null
    // req.body.checkin_status == null ||
    // req.body.is_booked == null ||
    // req.body.is_paid == null ||
    // req.body.has_key == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const storage = new Storage();

  storage
    .create(
      req.body.number,
      req.body.hotel_id,
      req.body.room_id || null,
      req.body.checkin_status || 0,
      req.body.is_booked || 0,
      req.body.is_paid || 0,
      req.body.guest_name || null,
      req.body.guest_num || null,
      req.body.has_key || 1,
      req.body.price || 0
    )
    .then((response) => {
      console.log(response);
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readManyStorage(req, res) {
  const storage = new Storage();

  storage
    .readMany(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readOneStorage(req, res) {
  const storage = new Storage();

  storage
    .readOne(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readOneStorageByRoomName(req, res) {
  const storage = new Storage();

  storage
    .readByRoomName(req.query.room_name, req.query.hotel_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function updateStorage(req, res) {
  if (
    req.body.storage_id == null
    // req.body.room_id == null ||
    // req.body.number == null ||
    // req.body.checkin_status == null ||
    // req.body.is_booked == null ||
    // req.body.is_paid == null ||
    // req.body.guest_name == null ||
    // req.body.has_key == null
  ) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const storage = new Storage();

  storage
    .updateStorage(
      req.body.storage_id,
      req.body.number,
      req.body.room_id,
      req.body.checkin_status,
      req.body.is_booked,
      req.body.is_paid,
      req.body.guest_name || null,
      req.body.guest_num || null,
      req.body.has_key,
      req.body.price
    )
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function clearStorageByID(req, res) {
  if (req.body.storage_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const storage = new Storage();

  storage
    .cleardataStoragebyID(req.body.storage_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function clearStorageByhotelID_CheckinStatus(req, res) {
  if (req.query.hotel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(message.issueMessage(message["400_BAD_REQUEST"], "SEND_HOTEL_ID"));
  }

  const storage = new Storage();

  storage
    .cleardataStoragebyhotelID(req.query.hotel_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function deleteStorageByID(req, res) {
  if (req.body.storage_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const storage = new Storage();

  storage
    .delete(req.body.storage_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

module.exports = {
  createStorage,
  readManyStorage,
  readOneStorage,
  readOneStorageByRoomName,
  updateStorage,
  //   updateStorageProcess,
  clearStorageByID,
  clearStorageByhotelID_CheckinStatus,
  deleteStorageByID,
};
