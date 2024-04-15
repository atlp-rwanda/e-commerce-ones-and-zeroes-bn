'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          userId: {
            allowNull: false;
            primaryKey: true;
            type: any;
            defaultValue: any;
          };
          password: { type: String; allowNull: false };
          firstName: { type: String; allowNull: false };
          isGoogle: { type: Boolean; defaultValue: any };
          isActive: { type: Boolean; allowNull: Boolean; defaultValue: any };
          role: { type: any; defaultValue: any };
          lastName: { type: String; allowNull: false };
          email: { type: String; unique: true; allowNull: false };
          createdAt: { allowNull: boolean; type: any; defaultValue: any };
          updatedAt: { allowNull: boolean; type: any; defaultValue: any };
        },
      ) => any;
    },
    Sequelize: {
      UUID: any;
      UUIDV4: any;
      STRING: any;
      DATE: any;
      BOOLEAN: any;
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      role: {
        defaultValue: 'user',
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isActive: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      isGoogle: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
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
