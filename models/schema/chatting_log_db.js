"use strict";
module.exports = (sequelize, DataTypes) => {
  const chatting_log_db = sequelize.define(
    "chatting_log_db",
    {
      room_name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      translated_question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      translated_answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      req_log_created: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
      identifier: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      relavance: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      needAdditionalInformation: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      on_off: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );
  chatting_log_db.associate = function (models) {
    this.belongsTo(models.room, {
      foreignKey: "room_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return chatting_log_db;
};
