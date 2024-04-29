'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface: { addColumn: (arg0: string, arg1: string, arg2: { type: any; allowNull: boolean; defaultValue:string; }) => any; }, Sequelize: {
    STRING: any; BOOLEAN: any; 
}) {

   await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue:"guest"
  });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface: { removeColumn: (arg0: string, arg1: string) => any; }, Sequelize: any) {

     await queryInterface.removeColumn('Users', 'role')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
