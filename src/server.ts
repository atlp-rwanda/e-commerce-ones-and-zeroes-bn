import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import swaggerUi from 'swagger-ui-express';
import specs from './docs';
import { sequelize } from './database/models/index';
import Auth from './routes/Auth';
import UserRoutes from './routes/UserRoutes';
import passport from './Auth/google.auth';
dotenv.config();

const session = require('express-session');
const app = express();
const port = process.env.PORT || 7000;
app.use(
  session({
    secret: 'your_secret_key_here',
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.session());
app.use(passport.initialize());
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', Auth);
app.use('/users', UserRoutes);
app.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log(`Database Connection status: Success\nRunning Port: ${port}`);
  } catch (e) {
    console.log(e);
  }
});
