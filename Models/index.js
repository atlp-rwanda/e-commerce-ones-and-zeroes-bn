const Sequelize = require('sequelize');
const dotenv = require('dotenv').config()
const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = require('./Users')(sequelize, Sequelize);
module.exports = db;
