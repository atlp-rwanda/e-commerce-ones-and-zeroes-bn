/* eslint-disable esversion: 6 */
const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./Models').sequelize;
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello, world!');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = app;
