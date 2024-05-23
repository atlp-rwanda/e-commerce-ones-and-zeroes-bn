import { Request, Response, NextFunction } from 'express';
import { db } from '../database/models';
import 'dotenv/config';
import authMiddleware from '../middleware/authMiddleware';
import { generateToken } from '../helps/generateToken';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

jest.mock('../database/models', () => ({
  db: {
    User: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('AuthMiddlware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('isAuthenticated', () => {
    it('returns 401 when authorization header is missing', async () => {
      const req = {
        headers: {
          authorization: null,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      try {
        await authMiddleware.isAuthenticated(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing authorization header',
      });
    });
    it('returns 401 when authorization header is invalid', async () => {
      const req = {
        headers: {
          authorization: 'Bearer',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      try {
        await authMiddleware.isAuthenticated(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Invalid authorization header',
      });
    });
    it('returns 404 when user is not found', async () => {
      const token = generateToken(
        'a91da155-2829-41c5-a4de-95f91b25e9b2',
        'christianinjoooa3@gmail.com',
        'christian',
        'Ishimwe',
        'buyer',
      );
      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      db.User.findOne = jest.fn().mockReturnValue(null);

      try {
        await authMiddleware.isAuthenticated(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No such user found',
      });
    });
    it('returns 200 when user is authenticated', async () => {
      const token = generateToken(
        'a91da155-2829-41c5-a4de-95f91b25e9b2',
        'christianinjoooa3@gmail.com',
        'christian',
        'Ishimwe',
        'buyer',
      );

      const req = {
        headers: {
          authorization: `Bearer ${token}`,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      db.User.findOne = jest.fn().mockReturnValue({
        userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
        firstName: 'christian',
        lastName: 'Ishimwe',
        email: 'christianinjoooa3@gmail.com',
        role: 'admin',
        isActive: true,
        createdAt: '2024-05-06T18:17:45.933Z',
        updatedAt: '2024-05-06T18:17:45.933Z',
      });

      try {
        await authMiddleware.isAuthenticated(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(next).toHaveBeenCalled();
    });

    it('returns 500 when jwt cannot be verified', async () => {
      const req = {
        headers: {
          authorization: `Bearer token`,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      jwt.verify = jest.fn().mockImplementation(() => {
        throw new JsonWebTokenError('jwt error');
      });

      try {
        await authMiddleware.isAuthenticated(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to verify user authentication',
      });
    });
  });

  describe('check user role', () => {
    it('returns 401 when user role is not admin', () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
        user: {
          userId: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
          firstName: 'celestin',
          lastName: 'Nshuti',
          email: 'nshuticelestin@gmail.com',
          role: 'buyer',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      try {
        authMiddleware.checkRole(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User is not authorized',
      });
    });

    it('calls next when user role is admin', () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
        user: {
          userId: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
          firstName: 'celestin',
          lastName: 'Nshuti',
          email: 'nshuticelestin@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      try {
        authMiddleware.checkRole(req, res, next);
      } catch (error) {
        console.log(error);
      }

      expect(next).toHaveBeenCalled();
    });
  });
});
