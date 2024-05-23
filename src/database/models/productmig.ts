'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: { STRING: any; FLOAT: any; INTEGER: any; ARRAY: any; DATE: any },
) => {
  class ProductMig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  ProductMig.init(
    {
      productId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      categoryId: DataTypes.STRING,
      vendorId: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.FLOAT,
      quantity: DataTypes.INTEGER,
      imageurl: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Define an array of strings
        allowNull: false // Set it to allowNull depending on your requirements
      },
      discount: DataTypes.STRING,
      expirydate: DataTypes.DATE,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'ProductMig',
    },
  );
  return ProductMig;
};
