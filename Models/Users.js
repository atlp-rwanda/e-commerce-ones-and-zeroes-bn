/*esversion: 6 */
const DataTypes= require('sequelize')
export default (sequelize, Sequelize) => {
  const User = sequelize.define('user', {
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  });
  return User;
};
