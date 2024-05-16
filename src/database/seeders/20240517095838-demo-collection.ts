'use strict';
const { v4: uuid } = require('uuid');

module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    const userEmail = 'christianinja35@gmail.com';
    const demoIellerId = '3cb67e73-cbba-4445-bdbd-820ebacc85cf';

    const userExists = await queryInterface.sequelize.query(
      `SELECT email FROM "Users" WHERE email = '${userEmail}'`,
    );

    if (!userExists[0].length) {
      await queryInterface.bulkInsert('Users', [
        {
          userId: demoIellerId,
          firstName: 'Christian',
          lastName: 'Ishimwe',
          email: userEmail,
          password: 'yourPassword', // replace 'yourPassword' with the actual password
          isVerified: false,
          role: 'buyer',
          isActive: false,
          isGoogle: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    await queryInterface.bulkInsert(
      'Collections',
      [
        {
          id: uuid(),
          sellerId: demoIellerId,
          name: 'Collection 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuid(),
          sellerId: demoIellerId,
          name: 'Collection 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.bulkDelete('Collections', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
