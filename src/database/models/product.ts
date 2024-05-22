'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: {
    JSON: any;
    UUID: any;
    STRING: any;
    BIGINT: any;
  },
) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Product.init(
    {
      product_id: DataTypes.UUID,
      category_id: DataTypes.STRING,
      vendor_id: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.BIGINT,
      quantity: DataTypes.BIGINT,
      image_url: DataTypes.JSON,
      discount: DataTypes.STRING,
      expiry_date: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );
  return Product;
};
