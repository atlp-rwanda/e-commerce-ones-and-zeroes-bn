import { createCollection } from '../controllers/productController';
import { db } from '../database/models';
import { addCollectionEmitter } from '../utils/notifications/addCollectionHandler';
import { saveCollectionToDbEmitter } from '../utils/notifications/saveCollectionToDbHandler';

jest.mock('../database/models', () => ({
  db: {
    User: {
      findByPk: jest.fn(),
    },
    Collection: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock('../utils/notifications/saveCollectionToDbHandler', () => ({
  addCollectionEmitter: {
    emit: jest.fn(),
  },
}));

jest.mock('../utils/notifications/saveCollectionToDbHandler', () => ({
  saveCollectionToDbEmitter: {
    emit: jest.fn(),
  },
}));

describe('createCollection', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {},
      user: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return 400 if name or sellerId is missing', async () => {
    await createCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Name and sellerId are required',
    });
  });

  it('should return 404 if user is not found', async () => {
    req.body.name = 'Test Collection';
    req.user.userId = 'user-1';

    db.User.findByPk.mockResolvedValue(null);

    await createCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 400 if collection already exists', async () => {
    req.body.name = 'Test Collection';
    req.user.userId = 'user-1';

    db.User.findByPk.mockResolvedValue({ userId: 'user-1' });
    db.Collection.findOne.mockResolvedValue({ name: 'Test Collection' });

    await createCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Collection already exists',
    });
  });
});

describe('createCollection2', () => {
  it('should create a new collection', async () => {
    const req: any = {
      body: {
        name: 'New Collection',
      },
      user: {
        firstName: 'John Doe',
        email: 'kevinrwema@gmail.com',
        status: 'active',
        role: 'SELLER',
        userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
      },
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce({ id: 'sellerId' });
    (db.Collection.findOne as jest.Mock).mockResolvedValueOnce(null);
    (db.Collection.create as jest.Mock).mockResolvedValueOnce({
      name: 'New Collection',
      sellerId: 'sellerId',
    });

    await createCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      name: 'New Collection',
      sellerId: 'sellerId',
    });

    // expect(addCollectionEmitter.emit).toHaveBeenCalled()
    // expect(saveCollectionToDbEmitter.emit).toHaveBeenCalled()
  });
});

describe('createCollection3', () => {
  let req: any;
  let res: any;
  it('should throw an error', async () => {
    const req: any = {
      body: {
        name: 'New Collection',
      },
      user: {
        firstName: 'John Doe',
        email: 'kevinrwema@gmail.com',
        status: 'active',
        role: 'SELLER',
        userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
      },
    };

    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    db.User.findByPk.mockRejectedValue(new Error('Internal Server Error'));

    await createCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
