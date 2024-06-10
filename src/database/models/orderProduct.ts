'use strict';

const { Model } = require('sequelize');
const Order = require('./order');
const Product = require('./product');
module.exports = (
  sequelize: any,
  DataTypes: { UUID: any; UUIDV4: any; STRING: any; INTEGER: any; DATE: any },
) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  OrderProduct.init(
    {
      orderProductId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      orderId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: Order,
          key: 'orderId',
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
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER,
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
      modelName: 'OrderProduct',
      timestamps: true,
    },
  );
  return OrderProduct;
};
