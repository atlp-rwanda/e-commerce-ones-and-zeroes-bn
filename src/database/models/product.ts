'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: {
    UUID: any;
    UUIDV4: any;
    STRING: any;
    DECIMAL: any;
    BOOLEAN: any;
    ARRAY: any;
    DATE: any;
    BOOLEAN: any;
    INTEGER: any;
  },
) => {
  class Product extends Model {
    static associate(models: any) {
      this.belongsTo(models.Collection, {
        foreignKey: 'collectionId',
        onDelete: 'CASCADE',
      });
      Product.hasMany(models.Wishlist, {
        foreignKey: 'productId',
        as: 'wishlists',
      });
    }
  }
  Product.init(
    {
      productId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      expiryDate: {
        type: DataTypes.DATE,
      },
      expired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      bonus: {
        type: DataTypes.STRING,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
      },
      isAvailable: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
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
      modelName: 'Product',
    },
  );
  return Product;
};
