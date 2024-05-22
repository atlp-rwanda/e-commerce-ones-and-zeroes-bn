'use strict';

const { v4: uuid } = require('uuid');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (
    queryInterface: {
      bulkInsert: (
        arg0: string,
        arg1: {
          product_id: string;
          category_id: string;
          vendor_id: string;
          name: string;
          description: string;
          price: number;
          quantity: number;
          image_url: string;
          discount: string;
          expiry_date: string;
          createdAt: Date;
          updatedAt: Date;
        }[],
      ) => any;
    },
    Sequelize: any,
  ) => {
    return queryInterface.bulkInsert('Products', [
      {
        product_id: uuid(),
        category_id: 'your-uuid-1',
        vendor_id: 'your-uuid-1',
        name: 'Product 1',
        description: 'Description of Product 1',
        price: 1000,
        quantity: 10,
        image_url: JSON.stringify([
          'https://example.com/image1.jpg',
          'https://example.com/image1-1.jpg',
        ]),
        discount: '10%',
        expiry_date: '2024-12-31',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        product_id: uuid(),
        category_id: 'your-uuid-2',
        vendor_id: 'your-uuid-2',
        name: 'Product 2',
        description: 'Description of Product 2',
        price: 1500,
        quantity: 5,
        image_url: JSON.stringify([
          'https://example.com/image1.jpg',
          'https://example.com/image1-1.jpg',
        ]),
        discount: '5%',
        expiry_date: '2024-12-31',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Add more seed data as needed
    ]);
  },

  down: async (
    queryInterface: { bulkDelete: (arg0: string, arg1: null, arg2: {}) => any },
    Sequelize: any,
  ) => {
    return queryInterface.bulkDelete('Products', null, {});
  },
};
function UUID(): string {
  throw new Error('Function not implemented.');
}
