"use strict";
module.exports = (sequelize, DataTypes) => {
  const storage = sequelize.define(
    "storage",
    {
      number: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      checkin_status: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
      is_booked: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      is_paid: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      guest_name: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      guest_num: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      has_key: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      price: {
        type: DataTypes.INTEGER(),
        allowNull: true,
        defaultValue: 0,
      },
      memo: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );
  storage.associate = function (models) {
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
  return storage;
};
