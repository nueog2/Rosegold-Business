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
  };
  return department;
};
