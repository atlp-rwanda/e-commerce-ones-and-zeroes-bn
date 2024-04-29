import {db, sequelize} from '../../database/models/index';

describe('Database Connection', () => {
    test('Should connect to the database', async () => {
      try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    });
  });
