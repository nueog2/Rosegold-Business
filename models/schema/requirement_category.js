"use strict";
module.exports = (sequelize, DataTypes) => {
  const requirement_category = sequelize.define(
    "requirement_category",
    {
      name : {
        type : DataTypes.CHAR(64),
        allowNull : false
      },
    },
    {
      paranoid: true,
    }
  );
  requirement_category.associate = function (models) {
    this.belongsTo(models.hotel, {
        foreignKey : "hotel_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })

      this.hasMany(models.requirement, {
        foreignKey : "requirement_category_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return requirement_category;
};