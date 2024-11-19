"use strict";
module.exports = (sequelize, DataTypes) => {
  const moon_notice = sequelize.define(
    "moon_notice",
    {
      content: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  moon_notice.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return moon_notice;
};
