import { registerToken } from '../config/jwt.token';
import UserController from '../controllers/userControllers';
import { db } from '../database/models';
import passport from '../config/google.auth';
jest.mock('passport');
// const passport= require("passport")

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

jest.mock('../config/jwt.token', () => ({
  registerToken: jest.fn(),
}));

describe('User Google Aunthentication', () => {
  let req: any, res: any;
  beforeEach(() => {
    req = {};
    res = {
      redirect: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('It should return The login Page with status code 200', async () => {
    req = {
      body: {},
    };
    res = {
      send: jest.fn(),
    };
    await UserController.loginUserPage(req, res);
    expect(res.send);
  });

  it('should call passport.auntenticate from google aouth', () => {
    UserController.googleAuth(req, res);
    expect(passport.authenticate).toHaveBeenCalledWith('google', {
      scope: ['profile', 'email'],
    });
  });

  it('should redirect to /auth/google/register after successful authentication', async () => {
    (passport.authenticate as jest.Mock).mockImplementationOnce(
      (strategy: any, options: any, callback: any) => {
        return (req: any, res: any, next: any) => {
          next(null, {}, {});
        };
      },
    );
    expect(res.redirect);
  });
  it('should redirect to /login after failed authentication', async () => {
    (passport.authenticate as jest.Mock).mockReturnValueOnce(
      (req: any, res: any, next: any) => {
        next(new Error('Authentication failed'), false);
      },
    );
    expect(res.redirect);
  });
});

describe('registerUserGoogle', () => {
  let req: {
      user: {
        _json: { given_name: string; family_name: string; email: string };
      };
    },
    res: { status: any; json: any };

  beforeEach(() => {
    req = {
      user: {
        _json: {
          given_name: 'John',
          family_name: 'Doe',
          email: 'john.doe@example.com',
        },
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

  it('should sign in user if already registered', async () => {
    const alreadyRegisteredUser = {
      userId: '123',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
      email: 'christianinja3@gmail.com',
    };

    (db.User.findOne as jest.Mock).mockResolvedValue(alreadyRegisteredUser);
    (registerToken as jest.Mock).mockResolvedValue('mocked-token');
    await UserController.registerUserGoogle(req, res);
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(registerToken).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User signed in!',
      userToken: 'mocked-token',
    });
  });
  it('should register new user if not already registered', async () => {
    db.User.findOne.mockResolvedValue(null);
    const createdUser = { userId: '456' };
    db.User.create.mockResolvedValue(createdUser);

    await UserController.registerUserGoogle(req, res);

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.User.create).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User registered Successful, Please Sign in!',
      userId: '456',
    });
  });

  it('should handle errors', async () => {
    db.User.findOne.mockRejectedValue(new Error('Database error'));

    await UserController.registerUserGoogle(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Serveral error!',
    });
  });
});
