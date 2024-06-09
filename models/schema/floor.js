"use strict";
module.exports = (sequelize, DataTypes) => {
  const floor = sequelize.define(
    "floor",
    {
      floor_number: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        //unique: true,
      },
    },
    {
      paranoid: true,
    }
  );

  floor.associate = function (models) {
    this.hasMany(models.room, {
      foreignKey: "floor_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };

  return floor;
};
