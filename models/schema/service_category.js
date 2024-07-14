"use strict";
module.exports = (sequelize, DataTypes) => {
  const service_category = sequelize.define(
    "service_category",
    {
      name: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      eng_name: {
        type: DataTypes.CHAR(40),
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  service_category.associate = function (models) {
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

    this.hasMany(models.service_category, {
      foreignKey: "service_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return service_category;
};
