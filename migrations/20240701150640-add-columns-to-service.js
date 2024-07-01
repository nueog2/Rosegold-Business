"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await [
      queryInterface.addColumn("services", "eng_name", {
        type: Sequelize.CHAR(20),
        allowNull: true,
      }),
      queryInterface.addColumn("services", "content", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
      queryInterface.addColumn("services", "purpose", {
        type: Sequelize.TEXT,
        allowNull: true,
      }),
    ];
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
