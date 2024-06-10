'use strict';

import { QueryInterface } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: QueryInterface,
    Sequelize: {
      UUID: any;
      UUIDV4: any;
      INTEGER: any;
      BOOLEAN: any;
      STRING: any;
      ENUM: any;
      DATE: any;
      literal: (arg0: string) => any;
    },
  ) {
    await queryInterface.createTable('Orders', {
      orderId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      userId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      cartId: {
        type: Sequelize.UUID,
      },
      addressId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      paid: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      paymentIntentId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM('processing', 'shipped', 'failed'),
        defaultValue: 'processing',
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
    await queryInterface.dropTable('Orders');
  },
};
