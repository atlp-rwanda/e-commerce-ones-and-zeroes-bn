import 'dotenv/config';
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import http from 'http';
import { Server } from 'socket.io';
import specs from './docs';
import startCronJob from './cronJob/password.cron.job';
import { changePasswordIgnored } from './middleware/changePasswordIgnored';
import passport from './config/google.auth';
import { db, sequelize } from './database/models/index';
import AuthRouters from './routes/Auth';
import routes from './routes';
const { productExpireTask } = require('./cronJob/productsCron');
import chats from './helps/chats';

import { cartExpiryJob } from './cronJob/cartExpiry.job';

dotenv.config();
productExpireTask.start();
const app = express();
const server = http.createServer(app);
var morgan = require('morgan');

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? false
        : ['http://localhost:5173', 'http://localhost:7000/api'],
  },
});
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const port = process.env.PORT || 7000;
const session = require('express-session');
chats.chats(io);
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api', changePasswordIgnored, routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', AuthRouters);

app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('server started');
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
    startCronJob();
    cartExpiryJob.start();
  } catch (e) {
    console.log(e);
  }
});

export default app;
