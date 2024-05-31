'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: any,
    Sequelize: {
      INTEGER: any;
      BOOLEAN: Boolean;
      UUID: any;
      UUIDV4: any;
      STRING: any;
      DATE: any;
      literal: (arg0: string) => any;
    },
  ) {
    await queryInterface.createTable('Carts', {
      cartId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userId: {
        allowNull: true,
        type: Sequelize.UUID,
        unique: true,
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
  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.dropTable('Carts');
  },
};
