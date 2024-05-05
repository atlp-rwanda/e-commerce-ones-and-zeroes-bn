'use strict';
import { DataTypes, Sequelize } from 'sequelize';

module.exports = {
  async up(queryInterface: any, Sequelize: any) {
    await queryInterface.createTable('Collections', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID, // Using Sequelize's UUID data type
        defaultValue: Sequelize.literal('uuid_generate_v4()'), // Assuming you have a UUID extension in PostgreSQL
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      sellerId: {
        allowNull: false, // This is the foreign key column
        type: DataTypes.UUID,
        references: {
          model: 'Users', // Name of the referenced model
          key: 'userId', // Primary key of the referenced model
        },
        onDelete: 'CASCADE', // Cascade deletion if User is deleted
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

  async down(queryInterface: any, Sequelize: any) {
    await queryInterface.dropTable('Collections');
  },
};
