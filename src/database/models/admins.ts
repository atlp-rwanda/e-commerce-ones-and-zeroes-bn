'use strict';
import {Model, DataTypes} from 'sequelize';

interface AdminsAttributes{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  telephone: string,
  password: string,
  role: string
}
module.exports = (sequelize: any) => {
  class Admins extends Model<AdminsAttributes> implements AdminsAttributes {
    id!: number;
    firstName!: string;
    lastName!: string;
    email!: string;
    password!: string;
    role!: string;
    telephone!: string;
    static associate(models: any) {
      // define association here
    }
  }
  Admins.init({
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true

    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telephone:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    role:{
      type: DataTypes.STRING,
      allowNull: false
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false
    }

    
  }, {
    sequelize,
    modelName: 'Admins',
  });
  return Admins;
};