import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'
import sequelize from './database/database'
import User from './models/userModels';
dotenv.config();

const app = express();
const port = process.env.PORT || 7000;
const databaseUrl= process.env.DATABASE_URL
app.use('/', routes);


app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});
