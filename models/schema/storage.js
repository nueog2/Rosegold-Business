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
      has_key: {
        type: DataTypes.INTEGER(),
        allowNull: false,
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
    this.hasMany(models.room, {
      foreignKey: "storage_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return storage;
};
