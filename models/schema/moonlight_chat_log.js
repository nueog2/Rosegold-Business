"use strict";
module.exports = (sequelize, DataTypes) => {
  const moonlight_chat_log = sequelize.define(
    "moonlight_chat_log",
    {
      foreign_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      korean_text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_where: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      foreign_lang: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  moonlight_chat_log.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return moonlight_chat_log;
};
