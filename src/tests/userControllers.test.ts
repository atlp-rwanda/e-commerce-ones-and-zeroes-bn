import express, { Express, Request, Response } from 'express';

import UserController from '../controllers/userControllers';
import { db } from '../database/models';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateToken } from '../helps/generateToken';

dotenv.config();

jest.mock('../database/models', () => ({
  db: {
    User: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(() => Promise.resolve(true)),
}));

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return 400 if email or password is not provided', async () => {
      const req = {
        body: {
          // email or password is not provided
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Email and password are required',
      });
    });

    it('should return 404 if user not found', async () => {
      const req = {
        body: {
          email: 'nonexistent@example.com',
          password: 'password',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      } as unknown as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('should return 401 if password is incorrect', async () => {
      const password = 'correctPassword';
      const req = {
        body: {
          email: 'john@example.com',
          password: 'incorrectPassword',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });

      // Mock bcrypt.compare to return false
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({
        message: 'Incorrect credentials',
      });
    });
    it('should return 401 if email is not verified', async () => {
      const req = {
        body: {
          email: 'existing@example.com',
          password: 'correctPassword',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      const mockUser = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password:
          '$2b$10$z5yV9gdX3OrxuJdPBiUa7eBv27u9mEVWmq2SvXW4oqyZC3tYy0A3u',
        isVerified: false, // Email is not verified
      };

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: 'Email not verified' });
    });

    it('should return token if login is successful', async () => {
      const req = {
        body: {
          email: 'existing@example.com',
          password: 'correctPassword',
        },
      } as Request;
      const res = {
        status: jest.fn().mockImplementation((status) => {
          return res;
        }),
        send: jest.fn(),
        json: jest.fn().mockImplementation((json) => {}),
      } as unknown as Response;

      const mockUser = {
        userId: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password:
          '$2b$10$z5yV9gdX3OrxuJdPBiUa7eBv27u9mEVWmq2SvXW4oqyZC3tYy0A3u',
        isVerified: true,
      };

      // Mock the database query to return the user with correct credentials
      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      // Mock bcrypt.compare to return true
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      // Mock token generation
      // const expectedToken = 'helloworld';
      // jest.spyOn(jwt, 'sign').mockImplementation((payload, secret, options) => {
      //   if (secret !== process.env.USER_SECRET) {
      //     throw new Error('USER SECRET not defined');
      //   }
      //   return 'mockToken';
      // });

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 500 if an error occurs', async () => {
      const req = {
        body: {
          email: 'existing@example.com',
          password: 'correctPassword',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      } as unknown as Response;

      const errorMessage = 'Database error';
      (db.User.findOne as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      );

      await UserController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to login',
        error: errorMessage,
      });
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '123';
      const email = 'test@example.com';
      const firstName = 'John';
      const lastName = 'Doe';
      const passwordLastChanged = new Date().toISOString();
      const role = 'seller';
      const isVerified = true;

      const token = generateToken(
        userId,

        email,

        firstName,

        lastName,
        passwordLastChanged,
        role,
        isVerified,
      );

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
    });

    it('should throw an error if JWT secret is not defined', () => {
      // Save the original value
      const originalSecret = process.env.JWT_SECRET;
      const passwordLastChanged = new Date().toISOString();
      // Make JWT_SECRET undefined
      delete process.env.JWT_SECRET;

      expect(() =>
        generateToken(
          '123',
          'test@example.com',
          'John',
          'Doe',
          passwordLastChanged,
          'seller',
          true,
        ),
      ).toThrowError('JWT secret not defined');

      // Restore the original value
      process.env.JWT_SECRET = originalSecret;
    });
  });
});
