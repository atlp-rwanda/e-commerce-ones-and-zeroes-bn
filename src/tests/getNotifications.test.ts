import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt, { genSalt, hash } from 'bcrypt';
import UserController from '../controllers/userControllers';
import { db } from '../database/models';
const jwt = require('jsonwebtoken');

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      findAll: jest.fn(),
    },
  },
}));

// Mocking bcrypt functions
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  genSalt: jest.fn(),
  hash: jest.fn().mockResolvedValue('hashedPassword'),
}));

//Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('getNotification1', () => {
  let req: any;
  let res: any;
  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userData = {
      dataValues: {
        password: 'hashedOldPassword',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 when notification is not found', async () => {
    req.body = {
      token: 'mockedToken',
    };
    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });
    (db.Notifications.findAll as jest.Mock).mockResolvedValueOnce(null);
    await UserController.getNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getNotification2', () => {
  let req: any;
  let res: any;
  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userData = {
      dataValues: {
        password: 'hashedOldPassword',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 when notification is found', async () => {
    req.body = {
      token: 'mockedToken',
    };
    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });
    (db.Notifications.findAll as jest.Mock).mockResolvedValueOnce({
      content: [1, 2, 3],
    });
    await UserController.getNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('getNotification3', () => {
  let req: any;
  let res: any;
  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    userData = {
      dataValues: {
        password: 'hashedOldPassword',
      },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when something went wrong', async () => {
    req.body = {
      token: 'mockedToken',
    };
    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });
    db.Notifications.findAll.mockRejectedValue(
      new Error('Internal Server Error'),
    );

    await UserController.getNotifications(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
