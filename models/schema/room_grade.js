"use strict";
module.exports = (sequelize, DataTypes) => {
  const room_grade = sequelize.define(
    "room_grade",
    {
      name: {
        type: DataTypes.CHAR(),
        allowNull: false,
      },
      max_occupancy: {
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      price_multiplier: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  room_grade.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.room, {
      foreignKey: "room_grade_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return room_grade;
};
