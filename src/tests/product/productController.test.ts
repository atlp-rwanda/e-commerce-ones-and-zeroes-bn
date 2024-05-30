import { Request, Response } from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
} from '../../controllers/productController';
import { db } from '../../database/models';
import cloudinary from '../../helps/cloudinaryConfig';
import { CustomRequest, User } from '../../controllers/productController';
// interface User {
//   role: string;
//   userId: string;
// }

// interface CustomRequest extends Request {
//   user?: User;
//   files?: any;
// }

jest.mock('../../database/models', () => ({
  db: {},
}));

jest.mock('../../database/models', () => ({
  db: {
    User: {
      findByPk: jest.fn(),
    },
    Collection: {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn(),
    },
    Product: {
      findByPk: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      findAll: jest.fn(),
    },
  },
}));

jest.mock('../../helps/cloudinaryConfig', () => ({
  uploader: {
    upload: jest.fn(),
  },
}));

describe('Collection and Product Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCollection', () => {
    it('should return 400 if name or sellerId is missing', async () => {
      const req = {
        body: {},
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      await createCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Name and sellerId are required',
      });
    });

    it('should return 404 if user is not found', async () => {
      const req = {
        body: {
          name: 'New Collection',
        },
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.User.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await createCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should return 400 if collection already exists', async () => {
      const req = {
        body: {
          name: 'Existing Collection',
        },
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.User.findByPk as jest.Mock).mockResolvedValueOnce({ id: 'sellerId' });
      (db.Collection.findOne as jest.Mock).mockResolvedValueOnce({
        name: 'Existing Collection',
      });

      await createCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Collection already exists',
      });
    });

    it('should create a new collection', async () => {
      const req = {
        body: {
          name: 'New Collection',
        },
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

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
    });

    it('should return 500 if there is a server error', async () => {
      const req = {
        body: {
          name: 'New Collection',
        },
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.User.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Server error');
      });

      await createCollection(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('createProduct', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if any required field is missing', async () => {
      const req = {
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
        body: {},
        params: { collectionId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf' },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      await createProduct(req as CustomRequest, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'All fields are required',
      });
    });

    it('should return 404 if collection is not found', async () => {
      const req = {
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },

        body: {
          name: 'New Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
        },

        files: [
          { buffer: Buffer.from('image1'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image2'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image3'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image4'), mimetype: 'image/jpeg' },
        ] as Express.Multer.File[],

        params: { collectionId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf' },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await createProduct(req as CustomRequest, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Collection not found',
      });
    });

    it('should return 400 if product already exists in the collection', async () => {
      const req = {
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
        files: [
          { buffer: Buffer.from('image1'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image2'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image3'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image4'), mimetype: 'image/jpeg' },
        ] as Express.Multer.File[],
        body: {
          name: 'Existing Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
        },
        params: { collectionId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf' },
      } as Partial<Request> as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({});
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce({});

      await createProduct(req as CustomRequest, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product already exists in this collection',
        existingProduct: {},
      });
    });

    it('should return 400 if we have the insufficient number of images', async () => {
      const req = {
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
        files: [
          { buffer: Buffer.from('image1'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image2'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image3'), mimetype: 'image/jpeg' },
        ] as Express.Multer.File[],
        body: {
          name: 'Existing Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
        },
        params: { collectionId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf' },
      } as Partial<Request> as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({});

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product must have between 4 to 8 images',
      });
    });
    it('should return 400 if the number of images is less than 4', async () => {
      const req = {
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
        files: [
          { buffer: Buffer.from('image1'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image2'), mimetype: 'image/jpeg' },
        ] as Express.Multer.File[],
        body: {
          name: 'New Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
        },
        params: { collectionId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf' },
      } as Partial<Request> as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({});

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Product must have between 4 to 8 images',
      });
    });

    it('should return 400 if no images are given', async () => {
      const req = {
        user: {
          name: 'John Doe',
          status: 'active',
          role: 'SELLER',
          userId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf',
        },
        files: [], // Empty files array
        body: {
          name: 'New Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
        },
        params: { collectionId: '3cb67e73-cbba-4445-bdbd-820ebacc85cf' },
      } as Partial<Request> as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({});

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No images given',
      });
    });

    it('should create a new product', async () => {
      const req = {
        body: {
          name: 'New Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          ec: 'Energy Class A',
        },
        files: [
          { buffer: Buffer.from('image1'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image2'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image3'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image4'), mimetype: 'image/jpeg' },
        ],
        params: { collectionId: 'collectionId' },
      } as Partial<CustomRequest> as CustomRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({});
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce(null);
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
        secure_url: 'image_url',
      });
      (db.Product.create as jest.Mock).mockResolvedValueOnce({
        name: 'New Product',
        price: 100,
        category: 'Electronics',
        expiryDate: '2024-12-31',
        bonus: 'Gift voucher',
        ec: 'Energy Class A',
        images: ['image_url', 'image_url', 'image_url', 'image_url'],
        collectionId: 'collectionId',
      });

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product added successfully',
        product: {
          name: 'New Product',
          price: 100,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          ec: 'Energy Class A',
          images: ['image_url', 'image_url', 'image_url', 'image_url'],
          collectionId: 'collectionId',
        },
      });
    });

    it('should return 500 if there is a server error during product creation', async () => {
      const req = {
        body: {
          name: 'New Product',
          price: 100,
          quantity: 1,
          category: 'Electronics',
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          ec: 'Energy Class A',
        },
        files: [
          { buffer: Buffer.from('image1'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image2'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image3'), mimetype: 'image/jpeg' },
          { buffer: Buffer.from('image4'), mimetype: 'image/jpeg' },
        ],
        params: { collectionId: 'collectionId' },
      } as Partial<CustomRequest> as CustomRequest;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response> as Response;

      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({});
      (db.Product.findOne as jest.Mock).mockResolvedValueOnce(null);
      (cloudinary.uploader.upload as jest.Mock).mockResolvedValue({
        secure_url: 'image_url',
      });
      (db.Product.create as jest.Mock).mockRejectedValue(
        new Error('Server error'),
      );

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
        error: new Error('Server error'),
      });
    });
  });
});

describe('Product Controller - getProducts', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 404 if no products are found', async () => {
    const req = {} as Partial<Request> as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.Product.findAll as jest.Mock).mockResolvedValueOnce([]);

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'no Products in store' });
  });

  it('should return 200 and the list of products if products are found', async () => {
    const req = {} as Partial<Request> as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    const mockProducts = [
      { id: 1, name: 'Product 1', expired: false },
      { id: 2, name: 'Product 2', expired: false },
    ];

    (db.Product.findAll as jest.Mock).mockResolvedValueOnce(mockProducts);

    await getProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockProducts);
  });
});
