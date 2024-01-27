"use strict";
module.exports = (sequelize, DataTypes) => {
  const system_language = sequelize.define(
    "system_language",
    {
      name_display : {
        type : DataTypes.CHAR(32),
        allowNull : false
      },
      name_system : {
        type : DataTypes.CHAR(32),
        allowNull : false
      }
    },
    {
      paranoid: true,
    }
  );
  system_language.associate = function (models) {
    this.belongsTo(models.hotel_language, {
      foreignKey : "system_language_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })
  };
  return system_language;
};