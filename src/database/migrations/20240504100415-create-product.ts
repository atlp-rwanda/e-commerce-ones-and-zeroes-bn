'use strict';
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.createTable('Products', {
      productId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      price: {
        allowNull: false,
        type: DataTypes.DECIMAL(10, 2),
      },
      category: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
      bonus: {
        type: DataTypes.STRING,
      },

      collectionId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: 'Collections',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable('Products');
  },
};
