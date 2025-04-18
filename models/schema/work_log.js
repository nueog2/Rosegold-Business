"use strict";
module.exports = (sequelize, DataTypes) => {
  const work_log = sequelize.define(
    "work_log",
    {
      status: {
        type: DataTypes.CHAR(),
        allowNull: false,
      },
      reason: {
        type: DataTypes.CHAR(),
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );
  work_log.associate = function (models) {
    this.belongsTo(models.user, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return work_log;
};
