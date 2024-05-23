'use strict';

import { sequelize } from "../models";

module.exports = {
  up: async (
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          productId: { allowNull: boolean; primaryKey: boolean; type: any };
          categoryId: { type: any; allowNull: boolean };
          vendorId: { type: any; allowNull: boolean };
          name: { type: any; allowNull: boolean };
          description: { type: any; allowNull: boolean };
          price: { type: any; allowNull: boolean };
          quantity: { type: any; allowNull: boolean };
          imageurl: { type: any; allowNull: boolean };
          discount: { type: any; allowNull: boolean };
          expirydate: { type: any; allowNull: boolean };
          createdAt: { allowNull: boolean; type: any; defaultValue: any };
          updatedAt: { allowNull: boolean; type: any; defaultValue: any };
        },
      ) => any;
    },
    Sequelize: {
      STRING: any;
      FLOAT: any;
      INTEGER: any;
      ARRAY: (arg0: any) => any;
      DATE: any;
      NOW: any;
    },
  ) => {
    await queryInterface.createTable('ProductMigs', {
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        
      },
      categoryId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vendorId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      imageurl: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
     
      discount: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expirydate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (
    queryInterface: { dropTable: (arg0: string) => any },
    Sequelize: any,
  ) => {
    await queryInterface.dropTable('ProductMigs');
  },
};
