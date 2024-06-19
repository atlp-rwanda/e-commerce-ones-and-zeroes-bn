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
      STRING: any;
      DATE: any;
      literal: (arg0: string) => any;
    },
  ) {
    await queryInterface.createTable('OrderProducts', {
      orderProductId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      orderId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      productId: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      quantity: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('OrderProducts');
  },
};
