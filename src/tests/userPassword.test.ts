import bcrypt from 'bcrypt';
import {
  handlePasswordResetRequest,
  resetPassword,
} from '../controllers/userControllers';
import { db } from '../database/models';
const jwt = require('jsonwebtoken');

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

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

describe('User Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handlePasswordResetRequest', () => {
    it('should handle error if email is missing', async () => {
      const mockRequest: any = {
        body: {},
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await handlePasswordResetRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Email is required',
      });
    });

    it('should handle error if user not found', async () => {
      const mockRequest: any = {
        body: { email: 'notfound@example.com' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await handlePasswordResetRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found',
      });
    });

    it('should send password reset email', async () => {
      const mockRequest: any = {
        body: { email: 'example@example.com' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        email: 'example@example.com',
        save: jest.fn().mockResolvedValueOnce({}),
      };

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      // Mock the sendPasswordResetEmail function
      jest.spyOn(global.console, 'log').mockImplementation(() => {});

      await handlePasswordResetRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password reset email sent successfully',
      });
    });

    it('should return error on 500 response', async () => {
      const mockRequest: any = {
        body: { email: 'example@example.com' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      jest.spyOn(db.User, 'findOne').mockImplementationOnce(async () => {
        throw new Error('Database error');
      });

      await handlePasswordResetRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });

  describe('resetPassword', () => {
    it('should handle error if new password is missing', async () => {
      const mockRequest: any = {
        body: { token: 'testToken' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await resetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'New password is required',
      });
    });

    it('should reset user password', async () => {
      const mockRequest: any = {
        body: { token: 'testToken', newPassword: 'newPassword' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockUser = {
        resetPasswordToken: 'testToken',
        resetPasswordExpires: new Date(Date.now() + 3600000),
        save: jest.fn().mockResolvedValueOnce({}),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        email: 'test@example.com',
      });

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const bcryptMock = jest.spyOn(bcrypt, 'hash');
      (bcryptMock as jest.Mock).mockResolvedValueOnce('hashedPassword');

      await resetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Password reset successfully',
      });
    });

    it('should return error if user not found', async () => {
      const mockRequest: any = {
        body: { token: 'testToken', newPassword: 'newPassword' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        email: 'test@example.com',
      });

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

      await resetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid token or user not found',
      });
    });

    it('should return 500 status and error message if an error occurs', async () => {
      const mockRequest: any = {
        body: { token: 'testToken', newPassword: 'newPassword' },
      };

      const mockResponse: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        email: 'test@example.com',
      });

      (db.User.findOne as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      await resetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal server error',
      });
    });
  });
});
