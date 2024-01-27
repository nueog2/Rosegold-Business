"use strict";
module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define(
    "room",
    {
      name : {
        type : DataTypes.CHAR(6),
        allowNull : false
      },
      floor : {
        type : DataTypes.INTEGER(),
        allowNull : false
      }
    },
    {
      paranoid: true,
    }
  );
  room.associate = function (models) {
    this.belongsTo(models.hotel, {
        foreignKey : "hotel_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
    this.hasMany(models.room, {
        foreignKey : "room_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return room;
};