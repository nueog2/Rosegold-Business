"use strict";
module.exports = (sequelize, DataTypes) => {
  const moonlight_guest = sequelize.define(
    "moonlight_guest",
    {
      name: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      num_guest: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      id_list: {
        type: DataTypes.TEXT(),
        allowNull: false,
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
  };
  return moonlight_guest;
};
