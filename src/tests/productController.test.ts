import ProductService from '../services/productService';
import CollectionService from '../services/collectionService';
import { ProductController } from '../controllers/productController';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { db } from '../database/models';

dotenv.config();

jest.mock('../database/models', () => ({
  db: {
    Product: {
      findByPk: jest.fn(),
      destroy: jest.fn(),
    },
    Collection: {
      findByPk: jest.fn(),
    },
  },
}));

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

describe('ProductController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('deleteProduct', () => {
    it('should throw an error if JWT_SECRET is not defined', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer validToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      delete process.env.JWT_SECRET;

      await expect(() =>
        ProductController.deleteProduct(req, res),
      ).rejects.toThrow('JWT_SECRET is not defined ');

      process.env.JWT_SECRET = 'your-secret'; // Reset the JWT_SECRET after the test
    });

    it('should return 401 if unauthorized', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: '',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('should return 401 if token is invalid or expired', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer invalidToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Invalid or expired token');
      });

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Invalid or expired token',
      });
    });

    it('should return 403 if user is not a seller', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer validToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        userId: '1',
        role: 'buyer',
      });

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You must be a seller to delete a product.',
      });
    });

    it('should return 404 if product not found', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer validToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        userId: '1',
        role: 'seller',
      });
      (db.Product.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Product not found.' });
    });

    it('should return 403 if user is not the owner of the product', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer validToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        userId: '1',
        role: 'seller',
      });
      (db.Product.findByPk as jest.Mock).mockResolvedValueOnce({
        collectionId: '1',
      });
      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({
        sellerId: '2',
      });

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'You can only delete your own products.',
      });
    });

    it('should return 200 if product is deleted successfully', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer validToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        userId: '1',
        role: 'seller',
      });
      (db.Product.findByPk as jest.Mock).mockResolvedValueOnce({
        collectionId: '1',
      });
      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce({
        sellerId: '1',
      });
      (db.Product.destroy as jest.Mock).mockResolvedValueOnce(1);

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product deleted successfully.',
      });
    });

    it('should return 404 if collection not found', async () => {
      const req = {
        params: {
          id: '1',
        },
        headers: {
          authorization: 'Bearer validToken',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      (jwt.verify as jest.Mock).mockReturnValueOnce({
        userId: '1',
        role: 'seller',
      });
      (db.Product.findByPk as jest.Mock).mockResolvedValueOnce({
        collectionId: '1',
      });
      (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await ProductController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Collection not found.' });
    });
  });

  describe('ProductService', () => {
    describe('getProductById', () => {
      it('should return a product if it exists', async () => {
        const product = { id: '1', name: 'Product 1' };
        (db.Product.findByPk as jest.Mock).mockResolvedValueOnce(product);

        const result = await ProductService.getProductById('1');

        expect(result).toEqual(product);
      });

      it('should return null if a product does not exist', async () => {
        (db.Product.findByPk as jest.Mock).mockResolvedValueOnce(null);

        const result = await ProductService.getProductById('1');

        expect(result).toBeNull();
      });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product if it exists', async () => {
      const mockProduct = { destroy: jest.fn() };
      db.Product.findByPk.mockResolvedValue(mockProduct);

      const result = await ProductService.deleteProduct('1');

      expect(db.Product.findByPk).toHaveBeenCalledWith('1');
      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should not delete a product if it does not exist', async () => {
      db.Product.findByPk.mockResolvedValue(null);

      const result = await ProductService.deleteProduct('1');

      expect(db.Product.findByPk).toHaveBeenCalledWith('1');
      expect(result).toBeNull();
    });
  });

  describe('CollectionService', () => {
    describe('getCollectionById', () => {
      // it('should return a collection if it exists', async () => {
      //   const collection = { id: '1', name: 'Collection 1' };
      //   (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce(collection);

      //   const result = await CollectionService.getCollectionById('1');

      //   expect(result).toEqual(collection);
      // });
      // // In productController.test.ts
      // it('should handle errors when fetching a collection', async () => {
      //   const error = new Error('Database error');
      //   (db.Collection.findByPk as jest.Mock).mockRejectedValueOnce(error);

      //   await expect(CollectionService.getCollectionById('1')).rejects.toThrow(
      //     'Database error',
      //   );
      // });

      it('should return null if a collection does not exist', async () => {
        (db.Collection.findByPk as jest.Mock).mockResolvedValueOnce(null);

        const result = await CollectionService.getCollectionById('1');

        expect(result).toBeNull();
      });
    });
  });
});
