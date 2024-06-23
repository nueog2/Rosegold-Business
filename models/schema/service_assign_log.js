"use strict";
module.exports = (sequelize, DataTypes) => {
  const service_assign_log = sequelize.define(
    "service_assign_log",
    {},
    {
      paranoid: true,
    }
  );
  service_assign_log.associate = function (models) {
    this.belongsTo(models.service, {
      foreignKey: "service_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });

    this.belongsTo(models.department, {
        foreignKey: "department_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    })
    
    // this.hasMany(models.service, {
    //   foreignKey: "service_id",
    //   sourceKey: "id",
    //   on_delete: "CASCADE",
    // });
  };
  return service_assign_log;
};
