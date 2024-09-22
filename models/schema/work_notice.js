"use strict";
module.exports = (sequelize, DataTypes) => {
  const work_notice = sequelize.define(
    "work_notice",
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
  work_notice.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.department, {
      foreignKey: "department_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.user, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return work_notice;
};
