import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt, { genSalt, hash } from 'bcrypt';
import UserController from '../controllers/userControllers';
import { db } from '../database/models';
const jwt = require('jsonwebtoken');

dotenv.config();

interface customRequest extends Request {
  token?: any;
}

// Mocking the database model
jest.mock('../database/models', () => ({
  db: {
    User: {
      findOne: jest.fn(),
      update: jest.fn(),
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

describe('Validate user, before updating password', () => {
  let req: Partial<customRequest>;
  let res: Partial<Response>;
  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
      body: {
        password: 'oldPassword',
        newPassword: 'newPassword',
        verifyNewPassword: 'newPassword',
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
  it('should extract token, password, newPassword, and verifyNewPassword from request body', async () => {
    await UserController.updatePassword(req as Request, res as Response);
  });

  it('should return user not found if user does not exist', async () => {
    req.body = {
      token: 'mockedToken',
    };

    // Mocking jwt.verify to return the decoded token
    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });

    // Mocking db.User.findOne to return null
    (db.User.findOne as jest.Mock).mockResolvedValueOnce(null);

    await UserController.updatePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'User not found',
    });
  });
});

describe('Once user validated, now test password Update', () => {
  let req: Partial<customRequest>;
  let res: Partial<Response>;
  let userData: any;
  beforeEach(() => {
    req = {
      token: 'mockedToken',
      body: {
        password: 'hashedOldPassword',
        newPassword: 'newPassword',
        verifyNewPassword: 'newPassword',
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

  it('We should query our database to obtain the hashed password', async () => {
    req.body = {
      token: 'mockedToken',
    };

    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });

    (db.User.findOne as jest.Mock).mockResolvedValueOnce(userData);

    await UserController.updatePassword(req as Request, res as Response);

    expect(userData.dataValues.password).toBe('hashedOldPassword');
  });

  it('Should return 401 with / When Wrong credentials are provided', async () => {
    req.body = {
      token: 'mockedToken',
    };

    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });

    (db.User.findOne as jest.Mock).mockResolvedValueOnce(userData);

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

    await UserController.updatePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Wrong credentials',
    });
  });

  it('Should return 200 when Login is successful', async () => {
    req.body = {
      token: 'mockedToken',
    };

    (jwt.verify as jest.Mock).mockReturnValueOnce({ userId: 'mockUserId' });

    (db.User.findOne as jest.Mock).mockResolvedValueOnce(userData);

    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

    (bcrypt.genSalt as jest.Mock).mockResolvedValueOnce('salt');

    (db.User.update as jest.Mock).mockResolvedValue([1]);

    await UserController.updatePassword(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'OK',
      message: 'Password updated successfully',
    });
  });
});
