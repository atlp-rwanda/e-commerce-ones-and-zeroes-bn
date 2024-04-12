import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import swaggerUi from 'swagger-ui-express';
import specs from './docs';

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
