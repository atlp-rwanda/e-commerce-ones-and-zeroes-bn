'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          Id: {
            allowNull: false;
            primaryKey: true;
            type: any;
            defaultValue: any;
          };
          firstName: { type: String; allowNull: false };
          lastName: { type: String; allowNull: false };
          email: { type: String; unique: false };
          password: { type: String; unique: false };
          passwordLastChanged: {
            allowNull: boolean;
            type: any;
            defaultValue: any;
          };
          isGoogle: { type: Boolean; defaultValue: any };
          isVerified: { type: Boolean; allowNull: false; defaultValue: any };
          isActive: { type: Boolean; allowNull: Boolean; defaultValue: any };
          createdAt: { allowNull: boolean; type: any; defaultValue: any };
          updatedAt: { allowNull: boolean; type: any; defaultValue: any };
        },
      ) => any;
    },
    Sequelize: {
      BOOLEAN: Boolean;
      UUID: any;
      UUIDV4: any;
      STRING: any;
      DATE: any;
      literal: (arg0: string) => any;
    },
  ) {
    await queryInterface.createTable('Users', {
      Id: {
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
        unique: false,
      },
      password: {
        type: Sequelize.STRING,
        unique: false,
      },
      isActive: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      isVerified: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      isGoogle: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      passwordLastChanged: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
