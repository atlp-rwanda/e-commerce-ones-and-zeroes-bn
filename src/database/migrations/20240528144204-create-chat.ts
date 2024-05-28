'use strict';

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      room: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      chats: {
        type: Sequelize.ARRAY(Sequelize.JSON),
        defaultValue: [],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },
  down: async (queryInterface:any, Sequelize:any) => {
    await queryInterface.dropTable('Chats');
  }
};
