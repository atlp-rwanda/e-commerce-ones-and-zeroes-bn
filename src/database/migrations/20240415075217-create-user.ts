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
          firstName: { type: String; allowNull: false };
          lastName: { type: String; allowNull: false };
          email: { type: String; unique: true; allowNull: any };
          password: { type: String; allowNull: any };
          isverified: { type: boolean; allowNull: any; defaultValue: false };
          isActive: { type: Boolean; allowNull: any; defaultValue: false };
          isGoogle: { type: Boolean; allowNull: any; defaultValue: false };
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
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      //isverify

      isverified: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },

      isActive: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      isGoogle: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN,
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
