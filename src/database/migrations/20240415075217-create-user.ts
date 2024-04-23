'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: { createTable: (arg0: string, arg1: { userId: { allowNull: false; primaryKey: true; type: any; defaultValue: any; }; firstName: { type: String, allowNull: false; }; lastName: { type: String; allowNull:false }; email: { type: String; unique: true; };password: { type: String; allowNull: any }; createdAt: { allowNull: boolean; type: any; defaultValue: any; }; updatedAt: { allowNull: boolean; type: any; defaultValue: any; }; }) => any; }, Sequelize: { UUID: any; UUIDV4: any; STRING: any; DATE: any; literal: (arg0: string) => any; }) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
       
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface: { dropTable: (arg0: string) => any; }, Sequelize: any) {
    await queryInterface.dropTable('Users');
  }
};
