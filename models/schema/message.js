"use strict";
module.exports = (sequelize, DataTypes) => {
  const message = sequelize.define(
    "message",
    {
      to_user_id: { type: DataTypes.INTEGER(), allowNull: false },
      message_article: { type: DataTypes.TEXT(), allowNull: false },
      status: {
        type: DataTypes.TINYINT(),
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  message.associate = function (models) {
    this.belongsTo(models.user, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return message;
};
