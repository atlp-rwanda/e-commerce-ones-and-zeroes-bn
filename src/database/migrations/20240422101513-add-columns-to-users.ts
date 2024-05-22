'use strict';

import { QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (
    queryInterface: QueryInterface,
    Sequelize: { STRING: any; DATE: any },
  ) => {
    await Promise.all([
      queryInterface.addColumn('Users', 'gender', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'birthdate', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'preferredLanguage', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'preferredCurrency', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn('Users', 'billingAddress', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },

  down: async (
    queryInterface: { removeColumn: (arg0: string, arg1: string) => any },
    Sequelize: any,
  ) => {
    await Promise.all([
      queryInterface.removeColumn('Users', 'gender'),
      queryInterface.removeColumn('Users', 'birthdate'),
      queryInterface.removeColumn('Users', 'preferredLanguage'),
      queryInterface.removeColumn('Users', 'preferredCurrency'),
      queryInterface.removeColumn('Users', 'billingAddress'),
    ]);
  },
};
