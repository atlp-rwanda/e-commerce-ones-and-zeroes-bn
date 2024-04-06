import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index'


dotenv.config();

const app = express();
const port = process.env.PORT || 7000;

app.use('/', routes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
