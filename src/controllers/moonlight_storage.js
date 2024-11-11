const message = require("../../config/message");
const models = require("../../models");
const { Storage } = require("../models/moonlight_storage");

function createStorage(req, res) {
  if (
    req.body.number == null ||
    req.body.hotel_id == null ||
    req.body.checkin_status == null ||
    req.body.is_booked == null ||
    req.body.is_paid == null ||
    req.body.has_key == null
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
      req.body.checkin_status,
      req.body.is_booked,
      req.body.is_paid,
      req.body.has_key
    )
    .then((response) => {
      console.log(response);
      return res.status(response.stauts).send(response);
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
    .readOne(req.query.storage_id)
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
    req.body.number == null ||
    req.body.checkin_status == null ||
    req.body.is_booked == null ||
    req.body.is_paid == null ||
    req.body.guest_name == null ||
    req.body.has_key == null
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
      req.body.number,
      req.body.checkin_status,
      req.body.is_booked,
      req.body.is_paid,
      req.body.guest_name,
      req.body.has_key
    )
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function updateStorageProcess(req, res) {
  if (req.body.storage_id == null || req.body.process_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const storage = new Storage();

  storage
    .updateProcess(req.body.storage_id, req.body.process_id)
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
    .deletebyID(req.body.storage_id)
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
  updateStorage,
  updateStorageProcess,
  clearStorageByID,
  deleteStorageByID,
};
