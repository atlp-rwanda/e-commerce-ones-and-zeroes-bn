import express, { Express, Request, Response } from 'express';

import UserController from '../controllers/userControllers'; // Import your controller
import { db } from '../database/models';
import dotenv from 'dotenv';
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

describe('Update User', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  // Add more test cases to cover edge cases and error scenarios

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, firstName: 'John', lastName: 'Doe' },
        { id: 2, firstName: 'Jane', lastName: 'Smith' },
      ];

      const req = {} as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      (db.User.findAll as jest.Mock).mockResolvedValueOnce(users);

      await UserController.getUsers(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',

        data: users,
      });
    });
    it('should return 500 if fetching users fails due to an error', async () => {
      // Mock request and response objects
      const req = {} as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the db.User.findAll function to throw an error
      jest.spyOn(db.User, 'findAll').mockImplementationOnce(async () => {
        throw new Error('Database error');
      });

      // Call the getUsers function
      await UserController.getUsers(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to fetch users',
      });
    });
  });
  describe('getSingleUser', () => {
    it('should return single user profile using id', async () => {
      const userId = 'bb9b8407-2d47-4e98-8b46-8a4b4f27fc2c';
      const req = {
        params: {
          id: userId,
        },
      } as unknown as Request;
      const mockUser = {
        userId: 'a41358ba-3cd3-424d-bb64-9540127675b3',
        firstName: 'christian',
        lastName: 'Ishimwe',
        email: 'christianinja3@gmail.com',
        password: process.env.WEAK_PASSWORD,
        isActive: false,
        isGoogle: false,
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      (db.User.findOne as jest.Mock).mockResolvedValueOnce(mockUser);

      await UserController.getSingleUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'User Profile',
        data: mockUser,
      });
    });
    it('should return 500 if fetching single user fails due to an error', async () => {
      // Mock request and response objects
      const req = {
        params: { id: '1' }, // Assuming id '1' for the test
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the db.User.findOne function to throw an error
      jest.spyOn(db.User, 'findOne').mockImplementationOnce(async () => {
        throw new Error('Database Error');
      });

      // Call the getSingleUser function
      await UserController.getSingleUser(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "provided ID doen't exist!",
        error: 'Database Error',
      });
    });
  });

  describe('updateSingleUser', () => {
    it('should update user profile and return 200 status code on success', async () => {
      // Mock request and response objects
      const req = {
        params: { id: '1' }, // Assuming id '1' for the test
        body: {
          firstName: 'Updated',
          lastName: 'User',
          gender: 'Male',
          birthdate: '1990-01-01',
          preferredLanguage: 'English',
          preferredCurrency: 'USD',
          billingAddress: '123 Main St, City, Country',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the db.User.findOne and save functions to return a user
      const user = {
        // Mocked user object
        firstName: 'Old',
        lastName: 'User',
        gender: 'Female',
        birthdate: '1980-01-01',
        preferredLanguage: 'Spanish',
        preferredCurrency: 'EUR',
        billingAddress: '456 Second St, City, Country',
        save: jest.fn().mockResolvedValueOnce(undefined), // Mock the save function
      };
      jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);

      // Call the updateSingleUser function
      await UserController.updateSingleUser(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Profile updated successfully',
        data: user,
      });
      // Check if the user properties are updated correctly
      expect(user.firstName).toBe(req.body.firstName);
      expect(user.lastName).toBe(req.body.lastName);
      expect(user.gender).toBe(req.body.gender);
      expect(user.birthdate).toBe(req.body.birthdate);
      expect(user.preferredLanguage).toBe(req.body.preferredLanguage);
      expect(user.preferredCurrency).toBe(req.body.preferredCurrency);
      expect(user.billingAddress).toBe(req.body.billingAddress);
    });

    it('should return 500 if updating user fails due to an error', async () => {
      // Mock request and response objects
      const req = {
        params: { id: '1' }, // Assuming id '1' for the test
        body: {
          firstName: 'Updated',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      // Mock the db.User.findOne function to throw an error
      jest.spyOn(db.User, 'findOne').mockImplementationOnce(async () => {
        throw new Error('Database error');
      });

      // Call the updateSingleUser function
      await UserController.updateSingleUser(req, res);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Internal Server Error',
        error: 'Database error',
      });
    });
  });

  // Write similar tests for other UserController methods (getUsers, getSingleUser, updateSingleUser)
});
