'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          userId: {
            allowNull: boolean;
            primaryKey: boolean;
            type: any;
            defaultValue: any;
          };
          firstName: { allowNull: boolean; type: any };
          lastName: { allowNull: boolean; type: any };
          email: { type: any; unique: boolean; allowNull: boolean };
          createdAt: { allowNull: boolean; type: any; defaultValue: any };
          updatedAt: { allowNull: boolean; type: any; defaultValue: any };
          isActive: { allowNull: boolean; defaultValue: any; type: any };
          role: { allowNull: boolean; type: any; defaultValue: any };
          isGoogle: { allowNull: boolean; type: any; defaultValue: any };
          isVerified: { allowNull: boolean; type: any; defaultValue: any };
          password: { allowNull: boolean; type: any };
          passwordLastChanged: {
            allowNull: boolean;
            type: any;
            defaultValue: any;
          };
        },
      ) => any;
    },
    Sequelize: {
      UUID: any;
      UUIDV4: any;
      STRING: any;
      DATE: any;
      BOOLEAN: any;
      ENUM: any;
      literal: (arg0: string) => any;
    },
  ) {
    await queryInterface.createTable('Users', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('seller', 'buyer', 'admin'),
        allowNull: false,
        defaultValue: 'buyer',
      },
      isGoogle: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      passwordLastChanged: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
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

  async down(
    queryInterface: { dropTable: (arg0: string) => any },
    Sequelize: any,
  ) {
    await queryInterface.dropTable('Users');
  },
};
