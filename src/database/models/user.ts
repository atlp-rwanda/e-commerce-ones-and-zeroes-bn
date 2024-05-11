'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: {
    BOOLEAN: any;
    UUID: any;
    UUIDV4: any;
    STRING: any;
    DATE: any;
  },
) => {
  class User extends Model {
    static associate(models: any) {
      // define association here
    }
  }
  User.init(
    {
      Id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isGoogle: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      passwordLastChanged: {
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
