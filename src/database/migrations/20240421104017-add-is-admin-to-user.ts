'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: { addColumn: (arg0: string, arg1: string, arg2: { type: any; allowNull: boolean; defaultValue: boolean; }) => any; }, Sequelize: { BOOLEAN: any; }) {

   await queryInterface.addColumn('Users', 'isAdmin', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
  });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface: { removeColumn: (arg0: string, arg1: string) => any; }, Sequelize: any) {

     await queryInterface.removeColumn('Users', 'isAdmin')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
