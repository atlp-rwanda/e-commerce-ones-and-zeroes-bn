'use strict';

module.exports = {
  up: async (queryInterface: { bulkInsert: (arg0: string, arg1: { firstName: string; lastName: string; email: string; password: string; tel: string; createdAt: Date; updatedAt: Date; }[]) => any; }, Sequelize: any) => {
    return queryInterface.bulkInsert('Administrators', [
      {
        firstName: 'christian',
        lastName: 'ishimwe',
        email: 'christian@gmail.com',
        password: 'password',
        tel: '123456789',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: 'ishimwe',
        lastName: 'christian',
        email: 'ishimwe@example.com',
        password: 'password',
        tel: '987654321',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface: { bulkDelete: (arg0: string, arg1: null, arg2: {}) => any; }, Sequelize: any) => {
    return queryInterface.bulkDelete('Administrators', null, {});
  }
};
