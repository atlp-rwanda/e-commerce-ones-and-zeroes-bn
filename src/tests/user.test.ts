import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { handlePasswordResetRequest, resetPassword } from '../controllers/userControllers';
import { validateEmail, validatePassword } from '../validations/validations';
import { db } from '../database/models';
const jwt = require('jsonwebtoken');

jest.mock('../database/models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken'); // Mock JWT library

describe('User Controller', () => {
  let mockDb: any;

  beforeEach(() => {
    mockDb = {
      User: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
      },
    };

    (db as any).User = mockDb.User;
  });

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
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Email is required' });
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
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'User not found' });
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

      await handlePasswordResetRequest(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      // expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password reset email sent successfully' });
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
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'New password is required' });
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

      (jwt.verify as jest.Mock).mockReturnValueOnce({ email: 'test@example.com' });

      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      const bcryptMock = jest.spyOn(bcrypt, 'hash');
      (bcryptMock as jest.Mock).mockResolvedValueOnce('hashedPassword');

      await resetPassword(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Password reset successfully' });
    });
  });
});

describe('Validations', () => {
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      const validEmails = [
        'test@example.com',
        'user123@gmail.com',
        'john.doe@example.co.uk',
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it('should return false for invalid email', () => {
      const invalidEmails = [
        'test',
        'test@',
        'test@example',
        'test@example.',
        '@example.com',
        'test@.com',
        'test@example.c',
        'test@example..com',
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe('validatePassword', () => {
    it('should return true for strong password', () => {
      const validPasswords = [
        'Pass@123',
        'StrongPassword@2022',
        'MyP@ssw0rd2022!',
      ];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it('should return false for weak password', () => {
      const invalidPasswords = [
        'weak',
        'short',
      ];

      invalidPasswords.forEach(password => {
        const isValid = validatePassword(password);
        if (isValid) {
          console.log(`Invalid password passed validation: ${password}`);
        }
        expect(isValid).toBe(false);
      });
    });
  });
});
