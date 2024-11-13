"use strict";
module.exports = (sequelize, DataTypes) => {
  const hotel = sequelize.define(
    "hotel",
    {
      name: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      contact_number: {
        type: DataTypes.CHAR(20),
        allowNull: false,
      },
      address_sido: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      address_sigungu: {
        type: DataTypes.CHAR(32),
        allowNull: false,
      },
      address_other: {
        type: DataTypes.CHAR(64),
        allowNull: false,
      },
      checkin_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      checkout_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      roomservice: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // 위도, 경도 필드 추가
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  hotel.associate = function (models) {
    this.hasMany(models.department, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.hotel_language, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.chatbot_docs, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.requirement_category, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.room, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.chatting_log, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.user, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.floor, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.work_notice, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.ai_request, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.storage, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return hotel;
};
