'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: {
    UUIDV4: any;
    DATE: any;
    UUID: any;
    INTEGER: any;
    TEXT: any;
  },
) => {
  class ProductReview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      this.belongsTo(models.Product, {
        foreignKey: 'productId',
        onDelete: 'CASCADE',
      });
      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  ProductReview.init(
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      productId: {
        type: DataTypes.UUID,
        allowNUll: false,
        references: {
          model: 'Products',
          key: 'id',
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      reviewComment: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      modelName: 'ProductReview',
    },
  );
  return ProductReview;
};
