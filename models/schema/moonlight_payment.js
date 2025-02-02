"use strict";
module.exports = (sequelize, DataTypes) => {
  const moonlight_payment = sequelize.define(
    "moonlight_payment",
    {
      apprNo: {
        //승인번호
        // type: DataTypes.STRING(),
        type: DataTypes.INTEGER(),
        allowNull: false,
      },
      apprDate: {
        //승인일자
        type: DataTypes.DATE(),
        allowNull: false,
      },
      cardNum: {
        // 카드 번호
        type: DataTypes.STRING(),
        allowNull: false,
      },
      cardName: {
        // 카드 명칭
        type: DataTypes.STRING(),
        allowNull: false,
      },
      acquirerName: {
        //매입사 이름
        type: DataTypes.STRING(),
        allowNull: false,
      },
      issuerCode: {
        //매입사 코드
        type: DataTypes.STRING(),
        allowNull: false,
      },
      acquirerCode: {
        //발급자 코드
        type: DataTypes.STRING(),
        allowNull: false,
      },
      merchantNumber: {
        //가맹점 번호
        type: DataTypes.STRING(),
        // type: DataTypes.INTEGER(),
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      notice: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
      url_list: {
        // fb 파일 주소 링크
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
      },
    },
    {
      paranoid: true,
    }
  );
  moonlight_payment.associate = function (models) {
    this.belongsTo(models.hotel, {
      foreignKey: "hotel_id",
      sourceKey: "id",
      on_delete: "CASCADE",
    });
  };
  return moonlight_payment;
};
