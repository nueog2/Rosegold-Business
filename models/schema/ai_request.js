"use strict";
module.exports = (sequelize, DataTypes) => {
  const ai_request = sequelize.define(
    "ai_request",
    {
      count: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
        //unique: true,
      },
    },
    {
      paranoid: true,
    }
  );

  ai_request.associate = function (models) {
    // this.hasMany(models.room, {
    //   foreignKey: "ai_request_id",
    //   sourceKey: "id",
    //   onDelete: "CASCADE",
    // });
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };

  return ai_request;
};
