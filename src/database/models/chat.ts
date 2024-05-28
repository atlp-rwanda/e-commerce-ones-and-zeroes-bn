'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize:any, DataTypes:any) => {
  class Chat extends Model {
    static associate(models:any) {
      // define association here if necessary
    }
  }
  Chat.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    room: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    chats: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      defaultValue: [],
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};
