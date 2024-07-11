'use strict';

/** @type {import('sequelize-cli').Migration} */
import { QueryInterface, Sequelize } from 'sequelize';
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.removeColumn('Products', 'category');
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.dropTable('Products');
  },
};
