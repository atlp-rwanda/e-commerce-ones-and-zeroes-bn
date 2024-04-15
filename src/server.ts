import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import db from './database/models/index';


dotenv.config();

const app = express();
const port = process.env.PORT || 7000;
app.use('/', routes);
db.sequelize.sync().then(() =>{
  app.listen(port, ()=>{
    console.log(`Database Connected: ${port}`)
  })

})