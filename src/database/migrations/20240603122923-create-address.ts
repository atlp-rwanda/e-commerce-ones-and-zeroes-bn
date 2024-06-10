'use strict';
/** @type {import('sequelize-cli').Migration} */
import { QueryInterface } from 'sequelize';

module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: {
      UUID: any;
      UUIDV4: any;
      INTEGER: any;
      STRING: any;
      DATE: any;
      literal: (arg0: string) => any;
    },
  ) {
    await queryInterface.createTable('Addresses', {
      addressId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        type: Sequelize.UUID,
      },
      country: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      province: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      district: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sector: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      street: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('Addresses');
  },
};
