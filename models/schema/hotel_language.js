"use strict";
module.exports = (sequelize, DataTypes) => {
  const hotel_language = sequelize.define(
    "hotel_language",
    {
      
    },
    {
      paranoid: true,
    }
  );
  hotel_language.associate = function (models) {
    this.belongsTo(models.hotel, {
        foreignKey : "hotel_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
    
      this.belongsTo(models.system_language, {
        foreignKey : "system_language_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return hotel_language;
};