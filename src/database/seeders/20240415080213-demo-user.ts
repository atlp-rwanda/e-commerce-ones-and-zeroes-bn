'use strict';
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
          email: 'christelnjeiauininja3@gmail.com',
          password: '',
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
