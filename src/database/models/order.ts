'use strict';
const { Model } = require('sequelize');
const User = require('./user');
const Cart = require('./cart');
const Address = require('./address');
module.exports = (
  sequelize: any,
  DataTypes: {
    UUID: any;
    UUIDV4: any;
    STRING: any;
    INTEGER: any;
    BOOLEAN: any;
    ENUM: any;
    DATE: any;
  },
) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Order.belongsToMany(models.Product, {
        through: models.OrderProduct,
        foreignKey: 'orderId',
        otherKey: 'productId',
      });
    }
  }
  Order.init(
    {
      orderId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        references: {
          model: User,
          key: 'userId',
        },
        type: DataTypes.UUID,
      },
      cartId: {
        type: DataTypes.UUID,
        references: {
          model: Cart,
          key: 'cartId',
        },
      },
      addressId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: Address,
          key: 'addressId',
        },
      },
      paid: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      paymentIntentId: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.ENUM('processing', 'shipped', 'failed'),
        defaultValue: 'processing',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      timestamps: true,
    },
  );
  return Order;
};
