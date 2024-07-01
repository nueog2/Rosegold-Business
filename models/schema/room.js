"use strict";
module.exports = (sequelize, DataTypes) => {
  const room = sequelize.define(
    "room",
    {
      name: {
        type: DataTypes.CHAR(6),
        allowNull: false,
      },
      // floor: {
      //   type: DataTypes.INTEGER(),
      //   allowNull: false,
      //   // references: {
      //   //   model: 'floors',
      //   //   key: 'floor_number' // 변경된 부분
      //   // },
      //   // onDelete: "CASCADE"
      // },
      price: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
      additional_service: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  room.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.floor, {
      foreignKey: "floor_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.room, {
      foreignKey: "room_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.chatting_log, {
      foreignKey: "room_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return room;
};
