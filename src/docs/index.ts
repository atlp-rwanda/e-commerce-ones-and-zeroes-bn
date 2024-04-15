import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

import swaggerJsdoc from 'swagger-jsdoc';
import { OpenAPIV3 } from 'openapi-types';
import servers from './servers';
import allPaths from './paths'; // Import the merged paths from the index file

const PORT = process.env.PORT || 3000; // Set the port from environment variable or default to 3000

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'OnesAndZereoes Ecommerce',
    version: '1.0.0',
    description: 'API Documentation for OnesAndZereoes Ecommerce',
    contact: {
      name: 'OnesAndZeroes',
      email: 'onesandzeroes@email.com',
      url: 'https//www.onesandzeroes.com',
    },
  },
  servers: [
    {
      url: `http://localhost:${PORT}`, // Use the port from environment variable
    },
    ...servers,
  ],
  paths: allPaths, // Use the merged paths here
};

const options = {
  swaggerDefinition,
  apis: ['../routes/*.ts', '../routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
