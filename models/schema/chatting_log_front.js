"use strict";
module.exports = (sequelize, DataTypes) => {
  const chatting_log_front = sequelize.define(
    "chatting_log_front",
    {
      user: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      front_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      translated_question: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      translated_answer: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );
  chatting_log_front.associate = function (models) {
    // this.belongsTo(models.room, {
    //   foreignKey: "room_id",
    //   sourceKey: "id",
    //   on_delete: "CASCADE",
    // });
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return chatting_log_front;
};
