"use strict";
module.exports = (sequelize, DataTypes) => {
  const role_assign_log = sequelize.define(
    "role_assign_log",
    {
      
    },
    {
      paranoid: true,
    }
  );
  role_assign_log.associate = function (models) {
    this.belongsTo(models.user, {
        foreignKey : "user_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
    this.belongsTo(models.role, {
        foreignKey : "role_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return role_assign_log;
};