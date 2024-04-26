import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import specs from './docs';

import { db, sequelize } from './database/models/index';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json());
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection has been established successfully.');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error);
  });

export default app;
