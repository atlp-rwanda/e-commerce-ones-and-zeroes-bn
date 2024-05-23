'use strict';
import { v4 as uuid } from 'uuid';
module.exports = {
  up: async (
    queryInterface: {
      bulkInsert: (
        arg0: string,
        arg1: {
          productId: string;
          categoryId: string;
          vendorId: string;
          name: string;
          description: string;
          price: number;
          quantity: number;
          imageurl: string[];
          discount: string;
          expirydate: Date;
          createdAt: Date;
          updatedAt: Date;
        }[],
        arg2: {},
      ) => any;
    },
    Sequelize: any,
  ) => {
    await queryInterface.bulkInsert(
      'ProductMigs',
      [
        {
          productId: uuid(),
          categoryId: 'cat1',
          vendorId: 'vendor1',
          name: 'Product 1',
          description: 'Description for product 1',
          price: 99.99,
          quantity: 10,
          imageurl: ['value4', 'value5'],
          discount: '10%',
          expirydate: new Date('2024-12-31'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          productId: uuid(),
          categoryId: 'cat2',
          vendorId: 'vendor2',
          name: 'Product 2',
          description: 'Description for product 2',
          price: 199.99,
          quantity: 20,
          imageurl: ['value1', 'value2'],
          discount: '15%',
          expirydate: new Date('2025-06-30'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  down: async (
    queryInterface: { bulkDelete: (arg0: string, arg1: null, arg2: {}) => any },
    Sequelize: any,
  ) => {
    await queryInterface.bulkDelete('ProductMigs', null, {});
  },
};
