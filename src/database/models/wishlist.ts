'use strict';
const { Model } = require('sequelize');

module.exports = (
  sequelize: any,
  DataTypes: {
    UUID: any;
    UUIDV4: any;
    STRING: any;
    DATE: any;
    BOOLEAN: any;
    NOW: any;
  },
) => {
  class Wishlist extends Model {
    static associate(models: any) {
      Wishlist.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
      Wishlist.belongsTo(models.Product, {
        foreignKey: 'productId',
        as: 'product',
      });
    }
  }

  Wishlist.init(
    {
      Id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      productId: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Wishlist',
    },
  );

  return Wishlist;
};
