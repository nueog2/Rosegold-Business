const message = require("../../config/message");
const Moonlight_Guest = require("../models/moonlight_guest").Moonlight_Guest;

function getMoonlightGuestMany(req, res) {
  const moonlight_guest = new Moonlight_Guest();
  moonlight_guest
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

function getMoonlightGuestOne(req, res) {
  const moonlight_guest = new Moonlight_Guest();
  moonlight_guest
    .readOne(req.query)
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

function updateMoonlightGuestProcess(req, res) {
  const moonlight_guest = new Moonlight_Guest();
  moonlight_guest
    .updateProcess(req.query.moonlight_guest_id, req.query.process)
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

function deleteMoonlightGuest(req, res) {
  const moonlight_guest = new Moonlight_Guest();
  moonlight_guest
    .delete(req.query.moonlight_guest_id)
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

function deleteMoonlightGuestbyHotelID(req, res) {
  const moonlight_guest = new Moonlight_Guest();
  moonlight_guest
    .deletebyhotel(req.query.hotel_id)
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
  getMoonlightGuestMany,
  getMoonlightGuestOne,
  updateMoonlightGuestProcess,
  deleteMoonlightGuest,
  deleteMoonlightGuestbyHotelID,
};
