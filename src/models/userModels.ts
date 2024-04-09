import sequelize from "../database/database";
const { Sequelize, DataTypes } = require('sequelize');
const User = sequelize.define('User', {
  // Model attributes are defined here
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING
  }
}
);

export default User