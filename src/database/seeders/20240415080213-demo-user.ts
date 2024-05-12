'use strict';
import dotenv from 'dotenv';
dotenv.config();
const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          userId: uuid(),
          firstName: 'christian',
          lastName: 'Ishimwe',
          email: 'christianinja3@gmail.com',
          password: process.env.password,
          role: 'seller',
          isVerified: false,
        },
        {
          userId: uuid(),
          firstName: 'celse',
          lastName: 'Nshuti',
          email: 'nshuticelestin@gmail.com',
          password: process.env.password,
          isVerified: false,
          role: 'seller',
        },
      ],
      {},
    );
  },

  async down(queryInterface: any, Sequelize: any) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     */
    await queryInterface.bulkDelete('Users', null, {});
  },
};
