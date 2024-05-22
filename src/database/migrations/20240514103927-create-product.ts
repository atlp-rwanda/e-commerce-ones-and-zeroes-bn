'use strict';

import { DataTypes } from 'sequelize';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(
    queryInterface: {
      createTable: (
        arg0: string,
        arg1: {
          id: {
            allowNull: boolean;
            autoIncrement: boolean;
            primaryKey: boolean;
            type: any;
          };
          product_id: { type: any };
          category_id: { type: any };
          vendor_id: { type: any };
          name: { type: any };
          description: { type: any };
          price: { type: any };
          quantity: { type: any };
          image_url: { type: any };
          discount: { type: any };
          expiry_date: { type: any };
          createdAt: { allowNull: boolean; type: any };
          updatedAt: { allowNull: boolean; type: any };
        },
      ) => any;
    },
    Sequelize: {
      JSON: any;
      INTEGER: any;
      UUID: any;
      STRING: any;
      BIGINT: any;
      DATE: any;
    },
  ) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      product_id: {
        type: Sequelize.UUID,
      },
      category_id: {
        type: Sequelize.STRING,
      },
      vendor_id: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.BIGINT,
      },
      quantity: {
        type: Sequelize.BIGINT,
      },
      image_url: {
        type: Sequelize.JSON,
      },

      discount: {
        type: Sequelize.STRING,
      },
      expiry_date: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(
    queryInterface: { dropTable: (arg0: string) => any },
    Sequelize: any,
  ) {
    await queryInterface.dropTable('Products');
  },
};
