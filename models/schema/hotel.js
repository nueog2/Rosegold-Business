"use strict";
module.exports = (sequelize, DataTypes) => {
  const hotel = sequelize.define(
    "hotel",
    {
      name : {
        type : DataTypes.CHAR(32),
        allowNull : false
      },
      contact_number : {
        type : DataTypes.CHAR(20),
        allowNull : false
      },
      address_sido : {
        type : DataTypes.CHAR(32),
        allowNull : false
      },
      address_sigungu : {
        type : DataTypes.CHAR(32),
        allowNull : false
      },
      address_other : {
        type : DataTypes.CHAR(64),
        allowNull : false
      },
      checkin_date : {
        type : DataTypes.CHAR(5),
        allowNull : false
      },
      checkout_date : {
        type : DataTypes.CHAR(5),
        allowNull : false
      }
    },
    {
      paranoid: true,
    }
  );
  hotel.associate = function (models) {
    this.hasMany(models.department, {
      foreignKey : "hotel_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })
    this.hasMany(models.hotel_language, {
      foreignKey : "hotel_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })
    this.hasMany(models.chatbot_docs, {
      foreignKey : "hotel_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })
    this.hasMany(models.requirement_category, {
      foreignKey : "hotel_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })
    this.hasMany(models.room, {
      foreignKey : "hotel_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })

    this.hasMany(models.user, {
      foreignKey : "hotel_id",
      sourceKey : "id",
      on_delete : "CASCADE"
    })
  };
  return hotel;
};