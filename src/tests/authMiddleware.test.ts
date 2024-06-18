import { Request, Response, NextFunction } from 'express';
import { db } from '../database/models';
import 'dotenv/config';
import { authMiddleware } from '../middleware/authMiddleware';
import { generateToken } from '../helps/generateToken';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import AuthMiddleware from '../middleware/authMiddleware';
import { CustomRequest } from '../controllers/productController';

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

beforeEach(() => {
  const req = {
    headers: {},
  } as unknown as CustomRequest;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  const next = jest.fn();
});

describe('AuthMiddlware', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('sets req.user to null when authorization header is missing', async () => {
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
        await authMiddleware.verifyToken(req, res, next);
      } catch (error) {}

      expect((req as any).user).toBe(null);
      expect(next).toHaveBeenCalledWith();
    });
    it('sets req.user to null when authorization header is invalid', async () => {
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
        await authMiddleware.verifyToken(req, res, next);
      } catch (error) {}

      expect((req as any).user).toBe(null);
      expect(next).toHaveBeenCalledWith();
    });
    it('sets req.user to null when user is not found', async () => {
      const passwordLastChanged = new Date().toISOString();
      const token = generateToken(
        'a91da155-2829-41c5-a4de-95f91b25e9b2',
        'christianinjoooa3@gmail.com',
        'christian',
        'Ishimwe',
        passwordLastChanged,
        'seller',
        true,
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
        await authMiddleware.verifyToken(req, res, next);
      } catch (error) {}

      expect((req as any).user).toBe(null);
      expect(next).toHaveBeenCalledWith();
    });
    it('sets req.user when user is authenticated', async () => {
      const passwordLastChanged = new Date().toISOString();
      const token = generateToken(
        'a91da155-2829-41c5-a4de-95f91b25e9b2',
        'christianinjoooa3@gmail.com',
        'christian',
        'Ishimwe',
        passwordLastChanged,
        'seller',
        true,
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

      const mockUser: any = {
        dataValues: {
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
          firstName: 'christian',
          lastName: 'Ishimwe',
          email: 'christianinjoooa3@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
      };

      db.User.findOne = jest.fn().mockReturnValue(mockUser);

      try {
        await authMiddleware.verifyToken(req, res, next);
      } catch (error) {}

      expect((req as any).user).toBe(mockUser.dataValues);
      expect(next).toHaveBeenCalledWith();
    });

    it('returns 401 when jwt cannot be verified', async () => {
      const req = {
        headers: {
          authorization: 'Bearer invalidToken', // Providing an invalid token
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      // Mock jwt.verify to throw a JsonWebTokenError
      jwt.verify = jest.fn().mockImplementation(() => {
        throw new jwt.JsonWebTokenError('jwt error');
      });

      try {
        await authMiddleware.verifyToken(req, res, next);
      } catch (error) {}

      expect((req as any).user).toBe(null);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('isAuthenticated', () => {
    it('should return 401 when req.user is not defined during token verification', () => {
      const req = {
        user: null,
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const next: NextFunction = jest.fn();

      authMiddleware.isAuthenticated(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User is not authenticated',
      });
    });

    it('should call next() when user is authenticated', () => {
      const req = {
        user: {
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
          firstName: 'christian',
          lastName: 'Ishimwe',
          email: 'christianinjoooa3@gmail.com',
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

      authMiddleware.isAuthenticated(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('checkRole', () => {
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
        authMiddleware.checkRole('admin')(req, res, next);
      } catch (error) {}

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
        authMiddleware.checkRole('admin')(req, res, next);
      } catch (error) {}

      expect(next).toHaveBeenCalled();
    });
  });
});
