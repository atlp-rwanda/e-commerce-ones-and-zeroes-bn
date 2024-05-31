'use strict';
const { Model } = require('sequelize');
const User = require('./user');

module.exports = (
  sequelize: any,
  DataTypes: {
    BOOLEAN: any;
    UUID: any;
    UUIDV4: any;
    STRING: any;
    DATE: any;
    NOW: any;
  },
) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Cart.belongsToMany(models.Product, {
        through: models.CartProduct,
        foreignKey: 'cartId',
        //otherKey: 'productId'
      });
    }
  }
  Cart.init(
    {
      cartId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: true,
        type: DataTypes.UUID,
        references: {
          model: User,
          key: 'Id',
        },
        unique: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Date.now(),
      },
    },
    {
      sequelize,
      modelName: 'Cart',
    },
  );
  return Cart;
};
