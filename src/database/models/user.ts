'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize: any, DataTypes: { UUID: any; UUIDV4: any; STRING: any; DATE: any; }) => {
  class User extends Model {
    static associate(models: any) {
      // define association here
    }
  }
  User.init({
    userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      passwordLastChanged: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now()
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now()
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now()
      }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};