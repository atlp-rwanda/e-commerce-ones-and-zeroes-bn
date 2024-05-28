import 'dotenv/config';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import specs from './docs';
import startCronJob from './cronJob/password.cron.job';
import { changePasswordIgnored } from './middleware/changePasswordIgnored';

import passport from './config/google.auth';
import { db, sequelize } from './database/models/index';
import AuthRouters from './routes/Auth';
import routes from './routes';
import { chats } from './helps/chats';
dotenv.config();

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 7000;
const session = require('express-session');

app.use(cors());
app.use(express.json());

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.session());
app.use(passport.initialize());

//Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', routes);
app.use('/api', changePasswordIgnored, routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', AuthRouters);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('server started');
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
    startCronJob();
  } catch (e) {
    console.log(e);
  }
});

export default app;
