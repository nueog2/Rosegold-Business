"use strict";
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      user_num: {
        type: DataTypes.CHAR(),
        allowNull: false,
      },
      user_id: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      user_pwd: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      phone: {
        type: DataTypes.CHAR(20),
        allowNull: false,
      },
      hotel_admin_user: {
        type: DataTypes.BOOLEAN(),
        allowNull: false,
        defaultValue: false,
      },
      fcm_token: {
        type: DataTypes.JSON(),

        allowNull: false,
        defaultValue: [],
      },
      fcm_token_web: {
        type: DataTypes.JSON(),

        allowNull: false,
        defaultValue: [],
      },
    },
    {
      paranoid: true,
    }
  );
  user.associate = function (models) {
    this.hasOne(models.role_assign_log, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.hasMany(models.requirement_log, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });

    this.hasMany(models.message, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });

    this.hasMany(models.work_log, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return user;
};
