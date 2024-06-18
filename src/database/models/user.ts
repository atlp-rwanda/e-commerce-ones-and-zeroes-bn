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
    ENUM: any;
  },
) => {
  class User extends Model {
    static associate(models: any) {
      User.hasMany(models.Wishlist, {
        foreignKey: 'userId',
        as: 'wishlists',
      });
      User.hasOne(models.Cart, {
        foreignKey: 'userId',
      });
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
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthdate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      preferredLanguage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      preferredCurrency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      billingAddress: {
        type: DataTypes.STRING,
        allowNull: true,
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
        type: DataTypes.DATE,
        defaultValue: Date.now(),
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },

      use2FA: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
