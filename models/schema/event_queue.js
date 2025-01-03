"use strict";
module.exports = (sequelize, DataTypes) => {
  const event_queue = sequelize.define(
    "event_queue",
    {
      event_type: {
        type: DataTypes.STRING(),
        allowNull: false,
      },
      processed: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        defaultValue: 0,
      },
      processed_at: {
        type: DataTypes.DATE, // 추가: 이벤트 처리 시간
        allowNull: true,
      },
    },
    {
      paranoid: true,
      timestamps: true,
      //   underscored: true,
    }
  );

  event_queue.associate = function (models) {
    event_queue.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      targetKey: "id",
      onDelete: "CASCADE",
    });
  };

  return event_queue;
};
