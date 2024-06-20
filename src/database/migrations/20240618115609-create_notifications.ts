'use strict';
import { QueryInterface } from 'sequelize';
import { DataTypes, Sequelize } from 'sequelize';
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.createTable('Notifications', {
      notificationId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID, // Using Sequelize's UUID data type
        defaultValue: Sequelize.literal('uuid_generate_v4()'), // Assuming you have a UUID extension in PostgreSQL
      },
      userId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      subject: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      body: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      isRead: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
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

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.dropTable('Notifications');
  },
};
