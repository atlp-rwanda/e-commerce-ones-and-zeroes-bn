import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import { AdminsSeeders } from './database/seeders/Admins.seeds';
import db from './database/models/index';
const addAdmins = ()=>{
  AdminsSeeders.forEach(admin =>{
    db.Admins.create(admin)
  })
}

dotenv.config();

const app = express();
const port = process.env.PORT || 7000;
const databaseUrl= process.env.DATABASE_URL
app.use('/', routes);
db.sequelize.sync().then(() =>{
  // addAdmins() //Initialise this to create the admins tests, only once
  app.listen(port, ()=>{
    console.log(`Database Connected: ${port}`)
  })

})