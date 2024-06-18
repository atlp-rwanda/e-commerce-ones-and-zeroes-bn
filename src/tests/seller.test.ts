import request from 'supertest';
import express, { Application, Request, Response } from 'express';
import speakeasy from 'speakeasy';
import sellerController from '../controllers/sellerController';
import { db } from '../database/models';
import { generateToken } from '../helps/generateToken';
import { CustomRequest } from '../controllers/productController';

// Mocking dependencies
jest.mock('../database/models', () => ({
  db: {
    User: {
      findByPk: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock('../helps/generateToken');
jest.mock('speakeasy', () => ({
  totp: {
    verify: jest.fn(),
  },
}));

const app: Application = express();
app.use(express.json());

// Middleware to mock req.user
app.use((req: Request, res: Response, next) => {
  next();
});

app.put('/toggle2FA', sellerController.toggle2FA);
app.post('/twoFAController/:userId', sellerController.twoFAController);
describe('sellerController', () => {
  describe('twoFAController', () => {
    it('should return 404 if user not found', async () => {
      (db.User.findByPk as jest.Mock).mockResolvedValue(null);
      const response = await request(app)
        .post('/twoFAController/1')
        .send({ token: '123456' });
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    });

    it('should return 401 if token is incorrect', async () => {
      const user = { secret: 'SECRET', use2FA: true };
      (db.User.findByPk as jest.Mock).mockResolvedValue(user);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(false);

      const response = await request(app)
        .post('/twoFAController/1')
        .send({ token: '123456' });
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('You provided an incorrect token');
    });

    it('should return JWT token if verification is successful', async () => {
      const user = {
        userId: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'seller',
        secret: 'SECRET',
        passwordLastChanged: new Date(),
        isVerified: true,
      };

      (db.User.findByPk as jest.Mock).mockResolvedValue(user);
      (speakeasy.totp.verify as jest.Mock).mockReturnValue(true);
      (generateToken as jest.Mock).mockReturnValue('jwt-token');

      const response = await request(app)
        .post('/twoFAController/1')
        .send({ token: '123456' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ verified: true, token: 'jwt-token' });
    });

    it('should return 500 if error occurs during 2FA verification', async () => {
      const errorMessage = 'Internal Server Error';
      (db.User.findByPk as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      const response = await request(app)
        .post('/twoFAController/1')
        .send({ token: '123456' });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Error during 2FA verification');
    });
  });
});
