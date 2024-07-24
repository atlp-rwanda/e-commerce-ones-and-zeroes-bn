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
import { sequelize } from './database/models/index';
import AuthRouters from './routes/Auth';
import routes from './routes';
const { productExpireTask } = require('./cronJob/productsCron');
import chats from './helps/chats';
import authMiddleware from './middleware/authMiddleware';
import { db } from './database/models';
import { cartExpiryJob } from './cronJob/cartExpiry.job';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();
productExpireTask.start();
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

var morgan = require('morgan');

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
const port = process.env.PORT || 7000;
const session = require('express-session');
chats.chats(io);
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
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
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', AuthRouters);

server.listen(port, async () => {
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
