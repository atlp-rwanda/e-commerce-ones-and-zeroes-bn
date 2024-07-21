import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt, { genSalt, hash } from 'bcrypt';
import UserController from '../controllers/userControllers';
import { db } from '../database/models';
const jwt = require('jsonwebtoken');

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      findOne: jest.fn(),
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

describe('getSingelNotification1', () => {
  let req: any;
  let res: any;

  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
      body: {
        notificationId: '1',
      },
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

  it('should read 1 notification', async () => {
    req.body = {
      token: 'mockedToken',
      notificationId: '2',
    };

    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });
    const mockedNotification = {
      userId: 456,
      notificationId: 123,
      isRead: false,
      save: jest.fn().mockResolvedValueOnce({
        userId: 456,
        notificationId: 123,
        isRead: true,
      }),
    };
    (db.Notifications.findOne as jest.Mock).mockResolvedValueOnce(
      mockedNotification,
    );

    await UserController.getSingleNotification(req, res);
    expect(mockedNotification.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

describe('getSingelNotification2', () => {
  let req: any;
  let res: any;

  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
      body: {
        notificationId: '1',
      },
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

  it('should return 404 when no notification is found', async () => {
    req.body = {
      token: 'mockedToken',
      notificationId: '2',
    };

    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });
    const mockedNotification = {
      userId: 456,
      notificationId: 123,
      isRead: false,
      save: jest.fn().mockResolvedValueOnce({
        userId: 456,
        notificationId: 123,
        isRead: true,
      }),
    };
    db.Notifications.findOne.mockResolvedValue(null);

    await UserController.getSingleNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

describe('getSingelNotification3', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      token: 'mockedToken',
      body: {
        notificationId: '1',
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if something went wrong', async () => {
    req.body = {
      token: 'mockedToken',
      notificationId: '2',
    };

    jwt.verify.mockImplementation(() => {
      throw new Error('Mocked error');
    });

    await UserController.getSingleNotification(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
