'use strict';
import { DataTypes, Model } from 'sequelize';

module.exports = (sequelize: any, DataTypes: any) => {
  class User extends Model {
    static associate(models: any) {
      // define association here
    }
  }
  User.init(
    {
      userId: {
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
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isGoogle: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      role: {
        allowNull: false,
        type: DataTypes.ENUM('buyer', 'seller', 'admin'),
        defaultValue: 'buyer',
      },
      passwordLastChanged: {
        allowNull: false,
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
