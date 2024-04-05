/* eslint-disable esversion: 6 */
import { DataTypes } from 'sequelize';
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
