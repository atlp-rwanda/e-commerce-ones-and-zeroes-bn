'use strict';
const { Model } = require('sequelize');
const User = require('./user');
module.exports = (
  sequelize: any,
  DataTypes: {
    INTEGER: any;
    BOOLEAN: any;
    UUID: any;
    UUIDV4: any;
    STRING: any;
    DATE: any;
  },
) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
      Address.belongsTo(models.User, {
        foreignKey: 'userId',
      });
    }
  }
  Address.init(
    {
      addressId: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUIDV4,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        allowNull: false,
        references: {
          model: User,
          foreignKey: 'userId',
        },
        type: DataTypes.UUIDV4,
      },
      country: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      province: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      district: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      sector: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      street: {
        allowNull: false,
        type: DataTypes.STRING,
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
      modelName: 'Address',
      timestamps: true,
    },
  );
  return Address;
};
