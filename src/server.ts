import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import swaggerUi from 'swagger-ui-express';
import specs from './docs';

import {db, sequelize} from './database/models/index'
import userRoutes from './routes/userRoutes';


dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api",userRoutes)
app.listen(port,async () => {
  try{
    await sequelize.authenticate();
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
  }catch(e){
    console.log(e)
  }
}
)

