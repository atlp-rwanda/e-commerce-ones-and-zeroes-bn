import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import swaggerUi from 'swagger-ui-express';
import specs from './docs';
import startCronJob from './helps/cron.job'
import {changePasswordIgnored} from './middleware/changePasswordIgnored'

import {db, sequelize} from './database/models/index'

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use('/api',  changePasswordIgnored, routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.listen(port,async () => {
  try{
    await sequelize.authenticate();
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
    // startCronJob();

  }catch(e){
    console.log(e)
  }
}
)

