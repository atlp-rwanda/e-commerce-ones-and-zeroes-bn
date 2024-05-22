'use strict';
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      bulkInsert: (
        arg0: string,
        arg1: {
          userId: any;
          firstName: string;
          lastName: string;
          email: string;
          password: any;
          isVerified: boolean;
        }[],
        arg2: {},
      ) => any;
    },
    Sequelize: any,
  ) {
    const hashedPassword1 = await bcrypt.hash('Password1239@', 10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          userId: uuid(),
          firstName: 'christian',
          lastName: 'Ishimwe',
          email: 'iigore2061@gmail.com',
          password: hashedPassword1,
          isVerified: true,
        },
        {
          userId: uuid(),
          firstName: 'celse',
          lastName: 'Nshuti',
          email: 'nshuticelestin@gmail.com',
          password: hashedPassword1,
          isVerified: false,
        },
      ],
      {},
    );
  },

  async down(
    queryInterface: { bulkDelete: (arg0: string, arg1: null, arg2: {}) => any },
    Sequelize: any,
  ) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
