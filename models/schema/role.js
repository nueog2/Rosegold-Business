"use strict";
module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "role",
    {
      name : {
        type : DataTypes.CHAR(16),
        allowNull : false
      },
    },
    {
      paranoid: true,
    }
  );
  role.associate = function (models) {
    this.belongsTo(models.department, {
        foreignKey : "department_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return role;
};