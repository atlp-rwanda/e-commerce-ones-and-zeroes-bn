import { Request, Response } from 'express';

import UserController from '../controllers/userControllers';
import { db } from '../database/models';
import 'dotenv/config';
import * as mailHelpers from '../utils/emails';

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

//jest.mock('../utils/emails')
const mockedNodeMail = jest.spyOn(mailHelpers, 'nodeMail').mockImplementation();

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('disableUser', () => {
    it('returns 404 when user is not found', async () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
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
        body: {
          reason: 'Harrasment of other users of the application',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue(null);

      db.User.update = jest.fn().mockReturnValue([0]);

      try {
        await UserController.disableUser(req, res);
      } catch (error) {
        console.error(error);
      }

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such User found' });
    });

    it('returns 403 when admin user attempts to self-disable', async () => {
      const req = {
        params: {
          id: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
        },
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
        body: {
          reason: 'Harrasment of other users of the application',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue({
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
      });

      db.User.update = jest.fn().mockReturnValue([0]);

      try {
        await UserController.disableUser(req, res);
      } catch (error) {
        console.error(error);
      }

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User cannot self-disable',
      });
    });

    it('returns 400 when no reason is provided', async () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
        user: {
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
          firstName: 'Christian',
          lastName: 'Ishimwe',
          email: 'christianinjoooa3@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
        body: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue({
        dataValues: {
          userId: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
          firstName: 'celestin',
          lastName: 'Nshuti',
          email: 'shemaallansurge@gmail.com',
          role: 'buyer',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
      });

      try {
        await UserController.disableUser(req, res);
      } catch (error) {
        console.log(error);
      }
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing reason for disabling account',
      });
    });

    it('returns 200 when user is disabled', async () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
        user: {
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
          firstName: 'Christian',
          lastName: 'Ishimwe',
          email: 'christianinjoooa3@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
        body: {
          reason: 'Harrasment of other users of the application',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue({
        dataValues: {
          userId: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
          firstName: 'celestin',
          lastName: 'Nshuti',
          email: 'shemaallansurge@gmail.com',
          role: 'buyer',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
      });

      db.User.update = jest.fn().mockReturnValue([1]);

      try {
        await UserController.disableUser(req, res);
      } catch (error) {
        console.log(error);
      }

      const firstName: string = 'celestin';
      console.log(firstName);
      const message: string = mailHelpers.successfullyDisabledAccountTemplate(
        firstName,
        'Harrasment of other users of the application',
      );

      expect(mockedNodeMail).toHaveBeenCalledWith(
        'shemaallansurge@gmail.com',
        'Your account was disabled',
        message,
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User account was successfully disabled',
      });
    });

    it('returns 200 when user is restored', async () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
        user: {
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
          firstName: 'Christian',
          lastName: 'Ishimwe',
          email: 'christianinjoooa3@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
        body: {
          reason: 'Harrasment of other users of the application',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue({
        dataValues: {
          userId: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
          firstName: 'celestin',
          lastName: 'Nshuti',
          email: 'shemaallansurge@gmail.com',
          role: 'buyer',
          isActive: false,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
      });

      db.User.update = jest.fn().mockReturnValue([1]);

      try {
        await UserController.disableUser(req, res);
      } catch (error) {
        console.log(error);
      }

      const message: string =
        mailHelpers.successfullyRestoredAccountTemplate('celestin');
      expect(mockedNodeMail).toHaveBeenCalledWith(
        'shemaallansurge@gmail.com',
        'Your account was restored',
        message,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'User account was successfully restored',
      });
    });

    it('returns 500 when database error occurs', async () => {
      const req = {
        params: {
          id: 'f2f98eeb-f579-411a-8f59-f2617beb261b',
        },
        user: {
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
          firstName: 'Christian',
          lastName: 'Ishimwe',
          email: 'christianinjoooa3@gmail.com',
          role: 'admin',
          isActive: true,
          createdAt: '2024-05-06T18:17:45.933Z',
          updatedAt: '2024-05-06T18:17:45.933Z',
        },
        body: {
          reason: 'Harrasment of other users of the application',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.User.findOne = jest.fn().mockReturnValue(() => {
        throw new Error('Database Error');
      });

      db.User.update = jest.fn().mockReturnValue(() => {
        throw new Error('Database Error');
      });

      try {
        await UserController.disableUser(req, res);
      } catch (error) {
        console.error(error);
      }

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to disable user account',
      });
    });
  });
});
