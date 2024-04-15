import { Request, Response, request } from 'express';
import UserController from '../controllers/userControllers';
import { db } from '../database/models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validateEmail, validatePassword } from '../validations/validations';
import app from '../server';
import { nodeMail } from '../utils/emails';

jest.mock('../database/models', () => ({
  db: {
    User: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('jsonwebtoken');

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 if required fields are missing', async () => {
      const req = { body: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'All fields are required',
      });
    });

    it('should return 400 if email is invalid', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'invalid-email',
          password: 'password123',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' });
    });

    it('should return 400 if password is not strong enough', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'weak',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Password should be strong',
      });
    });

    it('should return 400 if email already exists', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'StrongPassword123!',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce({});

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
    });

    //
    it('should return 500 if an unexpected error occurs', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'StrongPassword123!',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      (db.User.findOne as jest.Mock).mockImplementationOnce(async () => {
        throw new Error('Database error');
      });

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to register user',
      });
    });

    //
    it('should create a new user and return 201', async () => {
      const req: Request<any, any, any, any, Record<string, any>> = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'StrongPassword123!',
        },
      } as Request<any, any, any, any, Record<string, any>>;
      const res: Response<any, Record<string, any>> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response<any, Record<string, any>>;

      (db.User.create as jest.Mock).mockResolvedValueOnce({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to register user',
      });
    });
  });

  describe('getUsers', () => {
    it('should return all users with 200 status', async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const users = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ];

      (db.User.findAll as jest.Mock).mockResolvedValueOnce(users);

      await UserController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should return 500 if a database error occurs', async () => {
      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.User.findAll as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await UserController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to fetch users',
      });
    });
  });

  describe('isVerified', () => {
    it('should return 400 if no token is provided', async () => {
      const req = {
        params: {},
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await UserController.isVerified(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    });

    it('should return 400 if an invalid token is provided', async () => {
      const req = {
        params: { token: 'invalid-token' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jwt.verify = jest.fn().mockImplementation(() => {
        throw new jwt.JsonWebTokenError('Invalid token');
      });

      await UserController.isVerified(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid token content',
      });
    });

    it('should return 500 if user update fails', async () => {
      const req = {
        params: { token: 'valid-token' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jwt.verify = jest.fn().mockReturnValue({
        userId: 1,
      });

      (db.User.update as jest.Mock).mockResolvedValueOnce([0]);

      await UserController.isVerified(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'An error occurred during email verification',
      });
    });

    it('should return 200 when email verification is successful', async () => {
      const req = {
        params: { token: 'valid-token' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jwt.verify = jest.fn().mockReturnValue({
        userId: 1,
        email: 'john@example.com',
        name: 'John',
      });

      (db.User.update as jest.Mock).mockResolvedValueOnce([1]);

      await UserController.isVerified(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email successfully verified',
      });
    });
  });
});
