import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../helps/generateToken';
import { db } from '../database/models';
import { nodeMail, resetPasswordEmail } from '../utils/emails';
import jwt from 'jsonwebtoken';
import {
  handlePasswordResetRequest,
  resetPassword,
} from '../controllers/userControllers';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../database/models', () => ({
  db: {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    },
  },
}));
jest.mock('../utils/emails', () => ({
  nodeMail: jest.fn(),
  resetPasswordEmail: jest
    .fn()
    .mockReturnValue('mockedResetPasswordEmailTemplate'),
}));
jest.mock('../helps/generateToken', () => ({
  generateToken: jest.fn(),
}));

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handlePasswordResetRequest', () => {
    it('should handle error if email is missing', async () => {
      const mockRequest: Partial<Request> = {
        body: {},
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handlePasswordResetRequest(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required',
      });
    });

    it('should handle error if user not found', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'notfound@example.com' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await handlePasswordResetRequest(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User not found',
      });
    });

    it('should send password reset email', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'example@example.com' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        userId: 1,
        email: 'example@example.com',
        firstName: 'John',
        lastName: 'Doe',
        save: jest.fn().mockResolvedValueOnce({}),
      };

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (generateToken as jest.Mock).mockReturnValueOnce('testToken');

      await handlePasswordResetRequest(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockUser.save).toHaveBeenCalled();
      expect(nodeMail).toHaveBeenCalledWith(
        'example@example.com',
        'Reset password request',
        'mockedResetPasswordEmailTemplate',
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password reset email sent successfully',
      });
    });

    it('should return error on 500 response', async () => {
      const mockRequest: Partial<Request> = {
        body: { email: 'example@example.com' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(db.User, 'findOne').mockImplementationOnce(async () => {
        throw new Error('Database error');
      });

      await handlePasswordResetRequest(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('resetPassword', () => {
    it('should handle error if new password is missing', async () => {
      const mockRequest: Partial<Request> = {
        body: {},
        params: { token: 'testToken' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'New password is required',
      });
    });

    it('should reset user password', async () => {
      const mockRequest: Partial<Request> = {
        body: { newPassword: 'newPassword' },
        params: { token: 'testToken' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        email: 'test@example.com',
        resetPasswordToken: 'testToken',
        resetPasswordExpires: new Date(Date.now() + 3600000),
        save: jest.fn().mockResolvedValueOnce({}),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        email: 'test@example.com',
      });

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedPassword');

      await resetPassword(mockRequest as Request, mockResponse as Response);

      expect(mockUser.save).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password reset successfully',
      });
    });

    it('should return error if user not found', async () => {
      const mockRequest: Partial<Request> = {
        body: { newPassword: 'newPassword' },
        params: { token: 'testToken' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        email: 'test@example.com',
      });

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await resetPassword(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token or user not found',
      });
    });

    it('should return 500 status and error message if an error occurs', async () => {
      const mockRequest: Partial<Request> = {
        body: { newPassword: 'newPassword' },
        params: { token: 'testToken' },
      };

      const mockResponse: Partial<Response> = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        email: 'test@example.com',
      });

      (db.User.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await resetPassword(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});
