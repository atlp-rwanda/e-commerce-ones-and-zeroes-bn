import { Request, Response } from 'express';
import {
  createCollection,
  createProduct,
  getProducts,
  getUserCollections,
  deleteCollection,
  getProductsPerCollection,
} from '../../controllers/productController';
import { db } from '../../database/models';
import cloudinary from '../../helps/cloudinaryConfig';
import { CustomRequest } from '../../controllers/productController';
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
      findAll: jest.fn(),
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

jest.mock('../../utils/notifications/addProductHandler', () => ({
  addProductEmitter: {
    emit: jest.fn(),
  },
}));

jest.mock('../../utils/notifications/saveProductToDbHandler', () => ({
  saveProductToDbEmitter: {
    emit: jest.fn(),
  },
}));

describe('Collection and Product Controllers', () => {
  afterEach(() => {
    jest.clearAllMocks();
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
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          description: 'Product description',
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
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          description: 'Product description',
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
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          description: 'Product description',
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
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          description: 'Product description',
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
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          description: 'Product description',
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
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          ec: 'Energy Class A',
          description: 'Product description',
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
        expiryDate: '2024-12-31',
        bonus: 'Gift voucher',
        ec: 'Energy Class A',
        images: ['image_url', 'image_url', 'image_url', 'image_url'],
        collectionId: 'collectionId',
        description: 'Product description',
      });

      await createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product added successfully',
        product: {
          name: 'New Product',
          price: 100,
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          ec: 'Energy Class A',
          images: ['image_url', 'image_url', 'image_url', 'image_url'],
          collectionId: 'collectionId',
          description: 'Product description',
        },
      });
    });

    it('should return 500 if there is a server error during product creation', async () => {
      const req = {
        body: {
          name: 'New Product',
          price: 100,
          quantity: 1,
          expiryDate: '2024-12-31',
          bonus: 'Gift voucher',
          ec: 'Energy Class A',
          description: 'Product description',
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

describe('Product Controller - getUserCollections', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if sellerId is missing from the request', async () => {
    const req = {
      user: {},
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    await getUserCollections(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'sellerId is required',
    });
  });

  it('should return 404 if the user is not found', async () => {
    const req = {
      user: { userId: 'non-existent-id' },
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce(null);

    await getUserCollections(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'User not found',
    });
  });

  it('should return 200 with an empty array if no collections are found', async () => {
    const req = {
      user: { userId: 'valid-user-id' },
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce({
      id: 'valid-user-id',
    });
    (db.Collection.findAll as jest.Mock).mockResolvedValueOnce([]);

    await getUserCollections(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([]);
  });

  it('should return 200 with the list of collections if collections are found', async () => {
    const req = {
      user: { userId: 'valid-user-id' },
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    const mockCollections = [
      { id: 1, name: 'Collection 1', sellerId: 'valid-user-id' },
      { id: 2, name: 'Collection 2', sellerId: 'valid-user-id' },
    ];

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce({
      id: 'valid-user-id',
    });
    (db.Collection.findAll as jest.Mock).mockResolvedValueOnce(mockCollections);

    await getUserCollections(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCollections);
  });

  it('should return 500 if there is a server error', async () => {
    const req = {
      user: { userId: 'valid-user-id' },
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.User.findByPk as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    await getUserCollections(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal Server Error',
    });
  });
});
describe('Collection Controller - deleteCollection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if collectionId is missing from the request', async () => {
    const req = {
      params: {},
      user: { userId: 'valid-user-id' },
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    await deleteCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: 'CollectionId is required',
    });
  });

  it('should return 400 if sellerId is missing from the request', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
      user: {},
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    await deleteCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'sellerId is required' });
  });

  it('should return 404 if the user is not found', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
      user: { userId: 'non-existent-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce(null);

    await deleteCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('should return 404 if the collection is not found', async () => {
    const req = {
      params: { collectionid: 'non-existent-collection-id' },
      user: { userId: 'valid-user-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce({
      id: 'valid-user-id',
    });
    (db.Collection.findOne as jest.Mock).mockResolvedValueOnce(null);

    await deleteCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Collection not found' });
  });

  it('should return 200 and delete the collection successfully', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
      user: { userId: 'valid-user-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    const mockCollection = {
      id: 'valid-collection-id',
      destroy: jest.fn(),
    };

    (db.User.findByPk as jest.Mock).mockResolvedValueOnce({
      id: 'valid-user-id',
    });
    (db.Collection.findOne as jest.Mock).mockResolvedValueOnce(mockCollection);

    await deleteCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Collection deleted Successfully.',
    });
    expect(mockCollection.destroy).toHaveBeenCalled();
  });

  it('should return 500 if there is a server error', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
      user: { userId: 'valid-user-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    (db.User.findByPk as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    await deleteCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: new Error('Server error'),
    });
  });
});

describe('Collection Controller - getProductsPerCollection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if collectionId is missing from the request', async () => {
    const req = {
      params: {},
    } as Partial<CustomRequest> as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response> as Response;

    await getProductsPerCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'collection id is required',
    });
  });

  it('should return 200 with an empty array if no products are found', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({
      id: 'valid-collection-id',
    });
    (db.Product.findAll as jest.Mock).mockResolvedValueOnce([]);

    await getProductsPerCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'collection is empty',
      data: [],
    });
  });

  it('should return 200 with the list of products if products are found', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const mockProducts = [
      { id: 1, name: 'Product 1', collectionId: 'valid-collection-id' },
      { id: 2, name: 'Product 2', collectionId: 'valid-collection-id' },
    ];

    (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({
      id: 'valid-collection-id',
    });
    (db.Product.findAll as jest.Mock).mockResolvedValueOnce(mockProducts);

    await getProductsPerCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Products retrieved successfully',
      data: mockProducts,
    });
  });

  it('should return 500 if there is a server error', async () => {
    const req = {
      params: { collectionid: 'valid-collection-id' },
    } as unknown as CustomRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    (db.Collection.findByPk as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Server error');
    });

    await getProductsPerCollection(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: 'Server error',
    });
  });
});
