"use strict";
module.exports = (sequelize, DataTypes) => {
  const chatbot_docs = sequelize.define(
    "chatbot_docs",
    {
      docs_dir : {
        type : DataTypes.TEXT(),
        allowNull : false
      },
      file_name : {
        type : DataTypes.CHAR(64),
        allowNull : false
      }
    },
    {
      paranoid: true,
    }
  );
  chatbot_docs.associate = function (models) {
    this.belongsTo(models.hotel, {
        foreignKey : "hotel_id",
        sourceKey : "id",
        on_delete : "CASCADE"
      })
  };
  return chatbot_docs;
};