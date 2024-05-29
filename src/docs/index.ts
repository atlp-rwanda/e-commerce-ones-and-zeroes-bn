import dotenv from 'dotenv';
dotenv.config();

import swaggerJsdoc from 'swagger-jsdoc';
import { OpenAPIV3 } from 'openapi-types';
import allPaths from './paths';

const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

let serverUrl: string;
if (isProduction) {
  serverUrl = process.env.BACKEND_URI!;
} else {
  serverUrl = `http://localhost:${PORT}`;
}

const swaggerDefinition: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'OnesAndZereoes Ecommerce',
    version: '1.0.0',
    description: 'API Documentation for OnesAndZereoes Ecommerce',
    contact: {
      name: 'OnesAndZeroes',
      email: 'onesandzeroes@email.com',
      url: 'https://www.onesandzeroes.com',
    },
  },
  servers: [
    {
      url: serverUrl,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [],
  paths: allPaths,
};

const options = {
  swaggerDefinition,
  apis: ['../routes/*.ts', '../routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;