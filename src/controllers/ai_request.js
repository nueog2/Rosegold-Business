const message = require("../../config/message");
const Ai_Request = require("../models/ai_request").Ai_Request;

function addAiRequest(req, res) {
  const { count, hotel_id, yeartomonth } = req.body;

  if (count == null || hotel_id == null || yeartomonth == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETERS")
      );
  }

  const [year, month] = req.body.yeartomonth
    ? req.body.yeartomonth.split(",").map(Number)
    : [null, null];

  const ai_request = new Ai_Request();

  ai_request
    .addcount(count, hotel_id, year, month)
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

function getAiRequestAutoCountHandler(req, res) {
  const hotelId = req.query.hotel_id;
  const [year, month] = req.query.yeartomonth
    ? req.query.yeartomonth.split(",").map(Number)
    : [null, null];

  const ai_request = new Ai_Request();

  ai_request
    .getcount(hotelId, year, month)
    .then((response) => {
      console.log(response);
      return res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      if (!error.status) {
        return res
          .status(message["500_SERVER_INTERNAL_ERROR"].status)
          .send(
            message.issueMessage(
              message["500_SERVER_INTERNAL_ERROR"],
              "UNDEFINED_ERROR"
            )
          );
      } else {
        return res.status(error.status).send(error);
      }
    });
}

module.exports = {
  addAiRequest,
  getAiRequestAutoCountHandler,
};
