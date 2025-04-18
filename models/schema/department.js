"use strict";
module.exports = (sequelize, DataTypes) => {
  const department = sequelize.define(
    "department",
    {
      name: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      token_name: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      business_hour: {
        type: DataTypes.CHAR(),
        allowNull: true,
      },
    },
    {
      paranoid: true,
    }
  );
  department.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });

    this.hasMany(models.role, {
      foreignKey: "department_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });

    this.hasMany(models.requirement_log, {
      foreignKey: "process_department_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
    this.hasMany(models.work_notice, {
      foreignKey: "department_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });

    this.hasMany(models.service_assign_log, {
      foreignKey: "department_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });

    // this.hasMany(models.service_category, {
    //   foreignKey: "department_id",
    //   sourceKey: "id",
    //   onDelete: "CASCADE",
    // });
  };
  return department;
};
