import { authenticateToken, registerToken } from '../../Auth/jwt.tokens';
import dotenv from 'dotenv';
dotenv.config();
const jwt = require('jsonwebtoken');

describe('User controllers', () => {
  jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
  }));
  describe('Getting The user Token', () => {
    const secretKey = process.env.SECRET_KEY;
    const options = { expiresIn: '1w' };
    const expectedToken = `${process.env.expectedToken}`;
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('It should Return The token of the user', () => {
      const userPayload = {
        userId: 'd5da2f4c-31d3-4577-9f59-a9ff0d936772',
        firstName: 'ISHIMWE',
        lastName: 'Christian',
        role: 'user',
      };
      (jwt.sign as jest.Mock).mockReturnValueOnce(expectedToken);
      const token = registerToken(userPayload);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(userPayload, secretKey, options);
      expect(token).toBe(expectedToken);
    });
  });
});

jest.mock('jsonwebtoken');

describe('authenticateToken', () => {
  let req: any, res: any, next: any;

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'Bearer mock-token',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set req.user if token is valid', async () => {
    const user = { id: '123', role: 'user' };

    jwt.verify.mockImplementation(
      (
        token: any,
        secretKey: any,
        callback: (arg0: null, arg1: { id: string; role: string }) => void,
      ) => {
        callback(null, user);
      },
    );

    await authenticateToken(req, res, next);

    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 and "Login required" message if no token is provided', async () => {
    req.headers.authorization = undefined;

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith('Login required');
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 and "Token Expired" message if token is expired', async () => {
    jwt.verify.mockImplementation(
      (
        token: any,
        secretKey: any,
        callback: (arg0: { name: string }) => void,
      ) => {
        callback({ name: 'TokenExpiredError' });
      },
    );

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token Expired' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 and "Invalid Token" message if token is invalid', async () => {
    jwt.verify.mockImplementation(
      (token: any, secretKey: any, callback: (arg0: Error) => void) => {
        callback(new Error('Invalid token'));
      },
    );

    await authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid Token' });
    expect(next).not.toHaveBeenCalled();
  });
});
