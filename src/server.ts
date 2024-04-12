import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import session from 'express-session';
import passport from './auth/GoogleAuth'

import { AdminsSeeders } from './database/seeders/Admins.seeds';
import db from './database/models/index';
const addAdmins = ()=>{
  AdminsSeeders.forEach(admin =>{
    db.Admins.create(admin)
  })
}

dotenv.config();

const app = express();
app.use(session({secret: 'andela'}))
app.use(passport.initialize())
app.use(passport.session())
const port = process.env.PORT || 7000;
app.use('/', routes);
db.sequelize.sync().then(() =>{
  // addAdmins() //Initialise this to create the admins tests, only once
  app.listen(port, ()=>{
    console.log(`Database Connected: ${port}`)
  })

})