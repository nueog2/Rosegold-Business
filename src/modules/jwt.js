const randToken = require("rand-token");
const jwt = require("jsonwebtoken");
const models = require("../../models");
const message = require("../../config/message");
const secretKey = require("../../config/secret_key").secretKey;
const options = require("../../config/secret_key").options;
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;

const express = require("express");
const cookieParser = require("cookie-parser");

// app.use(express.json());
// app.use(cookieParser());

function signAccessToken(user) {
  return new Promise((resolve, reject) => {
    const payload = {
      id: user.id,
      name: user.name,
      user_id: user.user_id,
      hotel_id: user.hotel_id,
    };
    var refreshToken = randToken.uid(256);
    var accessToken = jwt.sign(payload, secretKey, options);

    if (accessToken) {
      var obj = Object.assign({}, message["200_SUCCESS"]);
      obj.access_token = accessToken;
      obj.refresh_token = refreshToken;
      resolve(obj);
    } else
      reject(
        message.issueMessage(
          message["500_SERVER_INTERNAL_ERROR"],
          "UNDEFINED_ERROR"
        )
      );
  });
}

function verifyToken(accessToken) {
  return new Promise((resolve, reject) => {
    let decoded;
    try {
      // verify를 통해 값 decode!
      decoded = jwt.verify(accessToken, secretKey);
      var obj = Object.assign({}, message["200_SUCCESS"]);
      obj.payload = decoded;
      return resolve(obj);
    } catch (err) {
      console.error(err);
      if (err.message === "jwt expired") {
        return reject(message["403_EXPIRED_TOKEN"]);
      } else if (err.message === "invalid token") {
        return reject(message["498_INVALID_TOKEN"]);
      } else {
        return reject(message["498_INVALID_TOKEN"]);
      }
    }
  });
}

function refreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    models.user
      .findOne({
        where: {
          refresh_token: refreshToken,
        },
      })
      .then((response) => {
        if (response) {
          signAccessToken({
            id: response.id,
            name: user.name,
            user_id: user.user_id,
          })
            .then((response) => {
              return resolve(response);
            })
            .catch((error) => {
              return reject(error);
            });
        } else {
          return reject(
            message.issueMessage(
              message["404_NOT_FOUND"],
              "USER_INFO_NOT_FOUND"
            )
          );
        }
      })
      .catch((error) => {
        return reject(error);
      });
  });
}

module.exports = {
  signAccessToken,
  verifyToken,
  refreshToken,
};
