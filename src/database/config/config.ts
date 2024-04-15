module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.PROD_DATABASE_URL,
    dialect: 'postgres',
    logging: false
  }
}