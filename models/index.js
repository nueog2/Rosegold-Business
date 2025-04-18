"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname + "/schema")
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname + "/schema", file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

const locker = require('../src/models/locker')(sequelize, Sequelize);
db.Locker = locker.Locker;
db.LockerSlot = locker.LockerSlot;

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sequelizeSync = function () {
  sequelize
    .sync({ force: false })
    .then(() => {
      console.log("DB Connected Success");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = db;