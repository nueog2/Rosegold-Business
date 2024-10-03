"use strict";
module.exports = (sequelize, DataTypes) => {
  const ex_question = sequelize.define(
    "ex_question",
    {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      paranoid: true,
    }
  );
  ex_question.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      onDelete: "CASCADE",
    });
  };
  return ex_question;
};
