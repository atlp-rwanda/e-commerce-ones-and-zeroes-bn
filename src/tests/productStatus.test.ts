import { Request, Response } from 'express';
import { ProductController } from '../controllers/productController';
import { db } from '../database/models';

// Mock the db object
jest.mock('../database/models', () => ({
  db: {
    Product: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    },
  },
}));

const mockRequest = (params?: any, body?: any): Partial<Request> => ({
  params,
  body,
});

const mockResponse = (): Partial<Response> => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('productController', () => {
  describe('getAvailableProduct', () => {
    it('should return available products with status 200', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (db.Product.findAll as jest.Mock).mockResolvedValue([
        { productId: 1, name: 'Product 1', isAvailable: true },
      ]);

      await ProductController.getAvailableProduct(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'List of available products in our store',
        allAvailableProducts: [
          { productId: 1, name: 'Product 1', isAvailable: true },
        ],
      });
    });

    it('should return 404 if no available products found', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (db.Product.findAll as jest.Mock).mockResolvedValue([]);

      await ProductController.getAvailableProduct(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No available products in our store',
      });
    });

    it('should handle errors with status 500', async () => {
      const req = mockRequest();
      const res = mockResponse();

      (db.Product.findAll as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await ProductController.getAvailableProduct(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });
  });

  describe('updateSingleProduct', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
      req = mockRequest({ productId: '1' });
      res = mockResponse();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    test('should update product status to available and return the updated product', async () => {
      const productMock = { productId: '1', isAvailable: false };
      (db.Product.findOne as jest.Mock).mockResolvedValue(productMock);

      await ProductController.updateSingleProduct(
        req as Request,
        res as Response,
      );

      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(db.Product.update).toHaveBeenCalledWith(
        { isAvailable: true },
        { where: { productId: '1' } },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product is successfully marked as available',
        isAvailable: true,
      });
    });

    test('should update product status to unavailable and return the updated product', async () => {
      const productMock = { productId: '1', isAvailable: true };
      (db.Product.findOne as jest.Mock).mockResolvedValue(productMock);

      await ProductController.updateSingleProduct(
        req as Request,
        res as Response,
      );

      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(db.Product.update).toHaveBeenCalledWith(
        { isAvailable: false },
        { where: { productId: '1' } },
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product is successfully marked as unavailable',
        isAvailable: false,
      });
    });

    test('should return 404 if product not found', async () => {
      (db.Product.findOne as jest.Mock).mockResolvedValue(null);

      await ProductController.updateSingleProduct(
        req as Request,
        res as Response,
      );

      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });

    test('should handle errors with status 500', async () => {
      const error = new Error('Database error');
      (db.Product.findOne as jest.Mock).mockRejectedValue(error);

      await ProductController.updateSingleProduct(
        req as Request,
        res as Response,
      );

      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Internal Server Error',
      });
    });

    test('should return 400 if productId is not provided', async () => {
      req.params = {}; // Ensure params is an empty object to simulate missing productId

      await ProductController.updateSingleProduct(
        req as Request,
        res as Response,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product productId is required',
      });
    });
  });
});
