"use strict";
module.exports = (sequelize, DataTypes) => {
  const chatting_log = sequelize.define(
    "chatting_log",
    {
      question : {
        type : DataTypes.TEXT,
        allowNull : false
      },
      answer : {
        type : DataTypes.TEXT,
        allowNull : false
      }
    },
    {
      paranoid: true,
    }
  );
  chatting_log.associate = function (models) {
    this.belongsTo(models.room, {
        foreignKey : "room_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return chatting_log;
};