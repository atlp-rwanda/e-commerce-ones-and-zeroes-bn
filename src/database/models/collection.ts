'use strict';
const { Model } = require('sequelize');
module.exports = (
  sequelize: any,
  DataTypes: { UUID: any; UUIDV4: any; STRING: any; DATE: any },
) => {
  class Collection extends Model {
    static associate(models: any) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'sellerId',
        onDelete: 'CASCADE',
      });
    }
  }
  Collection.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      name: {
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
      modelName: 'Collection',
    },
  );
  return Collection;
};
