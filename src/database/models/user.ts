"use strict";
const { Model } = require("sequelize");
module.exports = (
  sequelize: any,
  DataTypes: { UUID: any; UUIDV4: any; STRING: any; DATE: any; BOOLEAN: any }
) => {
  class User extends Model {
    static associate(models: any) {
      // define association here
    }
  }
  User.init(
    {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isActive: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      isGoogle: {
        allowNull: false,
        defaultValue: false,
        type: DataTypes.BOOLEAN,
      },
      gender:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      birthdate:{
        type: DataTypes.DATE,
        allowNull: true,
      },
      preferredLanguage:{
        type: DataTypes.STRING,
        allowNull: true,
      },
      preferredCurrency: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      billingAddress: {
        type: DataTypes.STRING,
        allowNull: true,
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
      modelName: "User",
    }
  );
  return User;
};
