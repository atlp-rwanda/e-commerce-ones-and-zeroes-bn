import express, { Request, Response } from 'express';
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

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('server started');
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
  } catch (e) {
    console.log(e);
  }
});

export default app;
