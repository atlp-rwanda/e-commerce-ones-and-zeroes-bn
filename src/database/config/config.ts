import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl:{
        require: true,
        rejectUnauthorized: false, 

      }
    }
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    ssl: true, // Enable SSL
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // For self-signed certificates
      },
    },
  },
};
