'use strict';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();
const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */

const defaultAdminEmail: string =
  process.env.DEFAULT_ADMIN_EMAIL || 'ecommerce1sand0s@gmail.com';
const defaultAdminPassword: string =
  process.env.DEFAULT_ADMIN_PASSWORD || 'Password123@';
const hashedPassword: string = bcrypt.hashSync(defaultAdminPassword, 10);

module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          userId: uuid(),
          firstName: 'admin',
          lastName: 'admin',
          email: defaultAdminEmail,
          password: hashedPassword,
          role: 'admin',
          isVerified: true,
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
