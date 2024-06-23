"use strict";
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define(
    "service",
    {
      name: {
        type: DataTypes.CHAR(20),
        allowNull: false,
      },
    },
    {
      content: {
        type: DataTypes.TEXT(),
        allowNull: false,
        defaultValue: "",
      },
    },
    {
      paranoid: true,
    }
  );
  service.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.service_category, {
      foreignKey: "service_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.service_category, {
      foreignKey: "service_category_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });

    this.hasMany(models.service_assign_log, {
      foreignKey: "service_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    // this.hasMany(models.service, {
    //   foreignKey: "service_id",
    //   sourceKey: "id",
    //   on_delete: "CASCADE",
    // });
  };
  return service;
};
