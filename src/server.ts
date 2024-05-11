import 'dotenv/config';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import specs from './docs';
import { sequelize } from './database/models/index';
import routes from './routes/index';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 7000;
app.use(cors());

//Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
  } catch (e) {
    console.log(e);
  }
});

export default app;
