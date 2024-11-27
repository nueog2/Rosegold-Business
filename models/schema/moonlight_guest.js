"use strict";
module.exports = (sequelize, DataTypes) => {
  const moonlight_guest = sequelize.define(
    "moonlight_guest",
    {
      name: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
      num_guest: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      id_list: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
      process: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  moonlight_guest.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.room, {
      foreignKey: "room_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return moonlight_guest;
};
