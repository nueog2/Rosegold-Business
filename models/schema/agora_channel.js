"use strict";
module.exports = (sequelize, DataTypes) => {
  const agora_channel = sequelize.define(
    "agora_channel",
    {
      process_id: {
        type: DataTypes.INTEGER(),
        allowNull: false,
        default: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  agora_channel.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return agora_channel;
};
