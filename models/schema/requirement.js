"use strict";
module.exports = (sequelize, DataTypes) => {
  const requirement = sequelize.define(
    "requirement",
    {
      name : {
        type : DataTypes.CHAR(64),
        allowNull : false
      },
      able_start_time : {
        type : DataTypes.DATE(),
        allowNull : false
      },
      able_end_time : {
        type : DataTypes.DATE(),
        allowNull : false
      },
      price : {
        type : DataTypes.INTEGER(),
        allowNull : false,
        defaultValue : 0
      },
      thumbnail_image_url : {
        type : DataTypes.TEXT(),
        allowNull : false,
        defaultValue : ""
      },
      description : {
        type : DataTypes.TEXT(),
        allowNull : false,
        defaultValue  :""
      }
    },
    {
      paranoid: true,
    }
  );
  requirement.associate = function (models) {
    this.belongsTo(models.requirement_category, {
        foreignKey : "requirement_category_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })

      this.hasMany(models.requirement_log, {
        foreignKey : "requirement_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return requirement;
};