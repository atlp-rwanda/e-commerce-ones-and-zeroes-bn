'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: { STRING: any; FLOAT: any; INTEGER: any; ARRAY: any; DATE: any },
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
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      name: DataTypes.STRING,
      category: DataTypes.STRING,
      bonus: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      images: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Define an array of strings
        allowNull: false, // Set it to allowNull depending on your requirements
      },
      discount: DataTypes.STRING,
      expirydate: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Product',
    },
  );
  return Product;
};
