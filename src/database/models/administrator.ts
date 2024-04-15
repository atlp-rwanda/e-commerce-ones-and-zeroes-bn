'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize: any, DataTypes: { STRING: any; }) => {
  class Administrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Administrator.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    tel: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Administrator',
  });
  return Administrator;
};