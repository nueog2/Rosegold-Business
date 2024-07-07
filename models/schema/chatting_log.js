"use strict";
module.exports = (sequelize, DataTypes) => {
  const chatting_log = sequelize.define(
    "chatting_log",
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
      // translated_question: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      // },
      // translated_answer: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      // },
      req_log_created: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  chatting_log.associate = function (models) {
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
  return chatting_log;
};
