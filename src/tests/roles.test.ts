import express, { Express, Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import UserController from '../controllers/userControllers';
import { db } from '../database/models';
import dotenv from 'dotenv';
dotenv.config();
import AuthMiddleware from '../middleware/authMiddleware';
import request from 'supertest';
import userRoute from '../routes/userRoutes';
import app from '../server';

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
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('set user roles', () => {
    it('should return a 400 status  if the role is not in the request', () => {
      const req = {
        body: { role: '' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      UserController.setUserRoles(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'role can not be empty',
      });
    });

    it('should return a 404 status  if the role is not in the request', async () => {
      const req = {
        params: { id: '11' },
        body: { role: 'admin' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);
      await UserController.setUserRoles(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'user not found' });
    });

    it('should update user role and return a 200 status', async () => {
      const req = {
        params: { id: 'f2f98eeb-f579-411a-8f59-f2617beb261b' },
        body: { role: 'admin' },
      } as unknown as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue({
        userId: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        firstName: 'celestin',
        lastName: 'Nshuti',
        email: 'nshuticelestin@gmail.com',
        role: 'seller',
        isActive: true,
        createdAt: '2024-05-06T18:17:45.933Z',
        updatedAt: '2024-05-06T18:17:45.933Z',
      });

      db.User.update = jest.fn().mockReturnValue([1]);

      await UserController.setUserRoles(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'user role updated' });

      expect(db.User.update).toHaveBeenCalledWith(
        { role: 'admin' },
        { where: { userId: req.params.id } },
      );
    });

    it('returns 500 when database error occurs', async () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue(async () => {
        throw new Error('Database Error');
      });

      db.User.update = jest.fn().mockReturnValue(async () => {
        throw new Error('Database Error');
      });
      await UserController.setUserRoles(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
