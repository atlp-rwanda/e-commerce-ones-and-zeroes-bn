'use strict';
const dotenv = require('dotenv').config();
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const configSuffix = env == 'development' ? '.ts' : '.js';
const config = require(__dirname + `/../config/config${configSuffix}`)[env];
const db: any = {};

let sequelize: any;
if (config.use_env_variable) {
  // @ts-ignore
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else if (config.url) {
  // @ts-ignore
  sequelize = new Sequelize(config.url, config);
} else {
  // @ts-ignore

  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

fs.readdirSync(__dirname)
  .filter((file: string) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) ===
        (process.env.NODE_ENV === 'development' ? '.ts' : '.js') &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach((file: any) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    // @ts-ignore
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  // @ts-ignore
  if (db[modelName].associate) {
    // @ts-ignore
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export { db, sequelize };
