const models = require("../../models");
const message = require("../../config/message");

class AgoraChannel {
  constructor() {}

  create(channel_name, process_id = 0) {
    return new Promise((resolve, reject) => {
      models.agora_channel
        .create({
          channel_name: channel_name,
          process_id: 0,
        })
        .then((response) => {
          if (response) {
            return resolve({
              status: message["200_SUCCESS"].status,
              agora_channel: response,
            });
          } else {
            return reject(
              message.issueMessage(
                message["500_SERVER_INTERNAL_ERROR"],
                "UNDEFINED_ERROR"
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readMany(condition) {
    return new Promise((resolve, reject) => {
      models.agora_channel
        .findAll({
          where: condition,
          attributes: [
            "id",
            "channel_name",
            "hotel_id",
            "process_id",
            "createdAt",
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.agoral_channels = response;
            return resolve(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "AGORA_CHANNEL_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  readOne(condition) {
    return new Promise((resolve, reject) => {
      models.agora_channel
        .findOne({
          where: condition,
          attributes: [
            "id",
            "channel_name",
            "hotel_id",
            "process_id",
            "createdAt",
          ],
        })
        .then((response) => {
          if (response.length > 0) {
            var obj = Object.assign({}, message["200_SUCCESS"]);
            obj.agora_channel = response;
            return response(obj);
          } else {
            return reject(
              message.issueMessage(
                message["404_NOT_FOUND"],
                "AGORA_CHANNEL_NOT_FOUND"
              )
            );
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  updateChannelName(channel_id, channel_name) {
    return new Promise((resolve, reject) => {
      models.agora_channel
        .update(
          {
            channel_name: channel_name,
          },
          {
            where: {
              id: channel_id,
            },
          }
        )
        .then((response) => {
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.agora_channel = response;
          return resolve(obj);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  updateProcess(channel_id, process_id) {
    return new Promise((resolve, reject) => {
      models.agora_channel
        .update(
          {
            process_id: process_id,
          },
          {
            where: {
              id: channel_id,
            },
          }
        )
        .then((response) => {
          var obj = Object.assign({}, message["200_SUCCESS"]);
          obj.agora_channel = response;
          return resolve(obj);
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }

  deletebyID(channel_id) {
    return new Promise((resolve, reject) => {
      models.agora_channel
        .destory({
          where: {
            channel_id: channel_id,
          },
        })
        .then((response) => {
          if (response > 0) {
            return resolve({
              status: message["200_SUCCESS"].status,
              message: "AGORA_CHANNEL_DELETED",
              agora_channel: response,
            });
          } else {
            return resolve({
              status: message["404_NOT_FOUND"].status,
              message: "CHATTING_LOG_NOT_FOUND",
              agora_channel: response,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          return reject(error);
        });
    });
  }
}

module.exports = {
  AgoraChannel,
};
