'use strict';

const { v4: uuidv4 } = require('uuid');

const demoCollectionId = '3cb67e73-cbba-4445-bdbd-820ebacc85cf';

module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    const collectionExists = await queryInterface.sequelize.query(
      `SELECT id FROM "Collections" WHERE id = '${demoCollectionId}'`,
    );

    if (!collectionExists[0].length) {
      await queryInterface.bulkInsert('Collections', [
        {
          id: demoCollectionId,
          sellerId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
          name: 'Collection 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }

    await queryInterface.bulkInsert(
      'Products',
      [
        {
          productId: uuidv4(),
          name: 'Product 1',
          price: 19.99,
          category: 'Category 1',
          expiryDate: new Date('2024-12-31'),
          bonus: 'Bonus 1',
          collectionId: demoCollectionId,
          images: ['image1.jpg', 'image2.jpg'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          productId: uuidv4(),
          name: 'Product 2',
          price: 29.99,
          category: 'Category 2',
          expiryDate: new Date('2025-06-30'),
          bonus: 'Bonus 2',
          collectionId: demoCollectionId,
          images: ['image3.jpg', 'image4.jpg'],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.bulkDelete('Products', {
      collectionId: demoCollectionId,
    });
    await queryInterface.bulkDelete('Collections', { id: demoCollectionId });
  },
};
