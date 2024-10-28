const { create } = require("lodash");
const message = require("../../config/message");
const models = require("../../modles");
const { AgoraChannel } = require("../models/agora_channel");

function createAgoraChannel(req, res) {
  if (req.body.channel_name == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const agora_channel = new AgoraChannel();

  agora_channel
    .create(req.body.channel_name)
    .then((response) => {
      console.log(response);
      return res.status(response.stauts).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readManyChannel(req, res) {
  const agora_channel = new AgoraChannel();

  agora_channel
    .readMany(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function readOneChannel(req, res) {
  const agora_channel = new AgoraChannel();

  agora_channel
    .readOne(req.query)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function updateChannelName(req, res) {
  if (req.body.channel_id == null || req.body.channel_name == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const agora_channel = new AgoraChannel();

  agora_channel
    .updateChannelName(req.body.channel_id, req.body.channel_name)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function updateChannelProcess(req, res) {
  if (req.body.channel_id == null || req.body.process_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const agora_channel = new AgoraChannel();

  agora_channel
    .updateProcess(req.body.channel_id, req.body.process_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

function deleteChannelByID(req, res) {
  if (req.body.channel_id == null) {
    return res
      .status(message["400_BAD_REQUEST"].status)
      .send(
        message.issueMessage(message["400_BAD_REQUEST"], "SEND_ALL_PARAMETER")
      );
  }

  const agora_channel = new AgoraChannel();

  agora_channel
    .deletebyID(req.body.channel_id)
    .then((response) => {
      return res.status(response.status).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(error.status).send(error);
    });
}

module.exports = {
  createAgoraChannel,
  readManyChannel,
  readOneChannel,
};
