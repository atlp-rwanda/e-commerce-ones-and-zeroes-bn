'use strict';
const Cart = require('./cart');
const Product = require('./product');

const { Model } = require('sequelize');

module.exports = (
  sequelize: any,
  DataTypes: {
    INTEGER: any;
    BOOLEAN: any;
    UUID: any;
    UUIDV4: any;
    STRING: any;
    DATE: any;
  },
) => {
  class CartProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  CartProduct.init(
    {
      cartProductId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      cartId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: Cart,
          key: 'cartId',
        },
      },
      productId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: Product,
          key: 'productId',
        },
      },
      quantity: DataTypes.INTEGER,
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
      modelName: 'CartProduct',
    },
  );
  return CartProduct;
};
