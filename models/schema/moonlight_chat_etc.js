"use strict";
module.exports = (sequelize, DataTypes) => {
  const moonlight_chat_etc = sequelize.define(
    "moonlight_chat_etc",
    {
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  moonlight_chat_etc.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return moonlight_chat_etc;
};
