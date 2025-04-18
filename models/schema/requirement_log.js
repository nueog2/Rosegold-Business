const Sequelize = require("sequelize");

("use strict");
module.exports = (sequelize, DataTypes) => {
  const requirement_log = sequelize.define(
    "requirement_log",
    {
      type: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      requirement_article: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      response_article: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      summarized_sentence: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      progress: {
        type: DataTypes.TINYINT(),
        allowNull: false,
        defaultValue: process.env.NOT_PROGRESS,
      },
      user_id: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },
      processed_info: {
        type: DataTypes.TEXT(),
        allowNull: false,
        defaultValue: "",
      },
      menu: {
        type: DataTypes.TEXT(),
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },
      num: {
        type: DataTypes.INTEGER(),
        allowNull: true,
      },
      pmsign: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      identifier: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      readcount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      paranoid: true,
    }
  );
  requirement_log.associate = function (models) {
    this.belongsTo(models.room, {
      foreignKey: "room_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.department, {
      foreignKey: "process_department_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.requirement, {
      foreignKey: "requirement_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
    this.belongsTo(models.user, {
      foreignKey: "user_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return requirement_log;
};
