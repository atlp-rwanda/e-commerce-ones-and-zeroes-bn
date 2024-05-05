import express, { Express, Request, Response } from 'express';

import UserController from '../controllers/userControllers';
import { db } from '../database/models';
import 'dotenv/config';

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

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 if email already exists', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john123@example.com',
          password: 'Pass@123',
        },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce({
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
      });

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Email already exists',
      });
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

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'password should be strong',
      });
    });
    it('should return 400 if email is not valid', async () => {
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

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

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

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'password should be strong',
      });
    });

    it('should register a new user', async () => {
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john123@example.com',
          password: process.env.password,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      (db.User.create as jest.Mock).mockResolvedValueOnce({
        id: 1,
        ...req.body,
      });

      try {
        await UserController.registerUser(req, res);
      } catch (error) {
        console.error(error);
      }

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Account created!',
        data: {
          id: 1,
          ...req.body,
        },
      });
    });

    it('should return 500 if registration fails due to an error', async () => {
      // Mock request and response objects
      const req = {
        body: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(db.User, 'findOne').mockImplementationOnce(async () => {
        throw new Error('Database error');
      });

      await UserController.registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to register user',
      });
    });
  });
});
