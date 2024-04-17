"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * chatting_log 테이블에 req_log_created 칼럼 추가
     */
    await queryInterface.addColumn("chatting_logs", "req_log_created", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * chatting_log 테이블에서 req_log_created 칼럼 제거
     */
    await queryInterface.removeColumn("chatting_logs", "req_log_created");
  },
};
