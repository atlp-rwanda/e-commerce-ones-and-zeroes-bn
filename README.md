[![HoundCI](https://img.shields.io/badge/reviewed%20by-Hound-%23a873d1.svg)](https://houndci.com)     [![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-commerce-ones-and-zeroes-bn/badge.svg?branch=develop)](https://coveralls.io/github/atlp-rwanda/e-commerce-ones-and-zeroes-bn?branch=develop)


 # e-commerce-ones-and-zeroes-bn
Ones-and-Zeroes e-commerce backend
POSTGRESS SEQUILIZER

Description

This Chores aims to configure a PostgreSQL database with Sequelize ORM for a Node.js API. PostgreSQL is an open-source, fully featured, and optimized SQL database engine suitable for production environments.

Why is this Important?

In core concept we used MongoDB, a NoSQL database. However in Team project we will use Postgress, PostgreSQL offers several advantages over MongoDB, including ACID compliance, better support for complex queries, and stronger consistency guarantees. Migrating to PostgreSQL can improve the scalability, reliability, and performance of the application.

Installation

Install dependencies: npm install
Configuration

Set up a PostgreSQL database.
Create a .env file in the project root directory with the following content:

DATABASE_URL='Your Postgress URL'
NODE_TLS_REJECT_UNAUTHORIZED='0'
Replace Postgress URL with Provided URL from pgadmin credentials.

Usage

For using the postgress database, first you will need to do the installation of pgadmin, for more information, refers to their official documentation of:  https://www.pgadmin.org/docs/#

Database Schema

for Creating the database, you will need to declare the datatype for models,
refer to their documentation for that: https://sequelize.org/docs/v6/core-concepts/model-basics/
the imports for initial setted, should be from : import sequilizer from './database/database'
Here below is the example of User model:

User
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

for the initiation or creating the model:
User.sync({force: true}).then(()=>{
      console.log("Table Created")
  }).catch(err =>{
      console.log('Failed to create the table')
  })
Technologies Used

Node.js
PostgreSQL
Sequelize
TablePlus



