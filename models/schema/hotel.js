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
      process: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
    },
    //   {
    //     paranoid: true,
    //   }
    // );
    {
      paranoid: true,
      // hooks: {
      //   // afterUpdate 훅 추가
      //   afterUpdate: async (hotel, options) => {
      //     if (hotel.previous("process") === 0 && hotel.process === 1) {
      //       try {
      //         await sequelize.models.event_queue.create({
      //           hotel_id: hotel.id,
      //           event_type: "Human_Detected", // 이벤트 유형
      //         });
      //         console.log(
      //           `Event 'Human_Detected' created for hotel ID ${hotel.id}`
      //         );
      //       } catch (error) {
      //         console.error("Error creating event_queue record:", error);
      //       }
      //     }
      //   },
      // },
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
    this.hasMany(models.moon_notice, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.moonlight_chat_log, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.event_queue, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return hotel;
};
