import express, { Express, Request, Response } from 'express';

import ProductController from '../controllers/productController';
import { db } from '../database/models';
import dotenv from 'dotenv';
import cloudinary from '../helps/cloudinaryConfig';

dotenv.config();
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
    },
  },
}));
jest.mock('../database/models', () => ({
  db: {
    Product: {
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    },
  },
}));
describe('Update Product', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Single Product Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 200 and the Product if found', async () => {
      // Arrange
      const req = {
        params: { productId: '1' },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const Product = {
        productId: '1',
        name: 'Product Name',
        description: 'Product Description',
        price: 100,
        quantity: 10,
        discount: '10%',
        expirydate: '2024-01-01',
      };

      jest.spyOn(db.Product, 'findOne').mockResolvedValue(Product);

      // Act
      await ProductController.getSingleProduct(req, res);

      // Assert
      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Retreived Product',
        data: Product,
      });
    });

    it('should return 500 if an internal server error occurs', async () => {
      // Arrange
      const req = {
        params: { productId: '1' },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(db.Product, 'findOne')
        .mockRejectedValue(new Error('Database Error'));

      // Act
      await ProductController.getSingleProduct(req, res);

      // Assert
      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Internal server error',
      });
    });
  });
  describe('updateProduct', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 404 if the product is not found', async () => {
      const req = {
        params: { productId: '1' },
        body: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(db.Product, 'findOne').mockResolvedValue(null);

      await ProductController.updateProduct(req, res);

      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Product not found',
      });
    });

    it('should update the product successfully', async () => {
      const req = {
        params: { productId: '1' },
        body: {
          name: 'Updated Product',
          description: 'Updated Description',
          category: 'Updated Category',
          bonus: 'Updated Bonus',
          price: '100',
          quantity: '20',
          discount: '10%',
        },
        files: [{ path: 'new-image-url1.jpg' }, { path: 'new-image-url2.jpg' }],
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const product = {
        productId: '1',
        name: 'Original Product',
        description: 'Original Description',
        category: 'Original Category',
        bonus: 'Original Bonus',
        price: '50',
        quantity: '10',
        discount: '5%',
        images: ['img1.jpg'],
        updatedAt: new Date(),
        save: jest.fn().mockResolvedValue(undefined),
      };

      jest.spyOn(db.Product, 'findOne').mockResolvedValue(product);
      (cloudinary.uploader.upload as jest.Mock)
        .mockResolvedValueOnce({ secure_url: 'uploaded-url1.jpg' })
        .mockResolvedValueOnce({ secure_url: 'uploaded-url2.jpg' });

      await ProductController.updateProduct(req, res);

      expect(db.Product.findOne).toHaveBeenCalledWith({
        where: { productId: '1' },
      });
      expect(cloudinary.uploader.upload).toHaveBeenCalledTimes(2);
      expect(product.name).toBe('Updated Product');
      expect(product.description).toBe('Updated Description');
      expect(product.category).toBe('Updated Category');
      expect(product.bonus).toBe('Updated Bonus');
      expect(product.price).toBe('100');
      expect(product.quantity).toBe('20');
      expect(product.discount).toBe('10%');
      expect(product.images).toContain('uploaded-url1.jpg');
      expect(product.images).toContain('uploaded-url2.jpg');
      expect(product.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Product updated successfully',
        data: product,
      });
    });
    it('should return 500 if an error occurs during update', async () => {
      const req = {
        params: { productId: '1' },
        body: {
          name: 'Updated Product',
          description: 'Updated Description',
          category: 'Updated Category',
          bonus: 'Updated Bonus',
          price: '100',
          quantity: '20',
          discount: '10%',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const error = new Error('Database error');
      jest.spyOn(db.Product, 'findOne').mockRejectedValueOnce(error);

      await ProductController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error',
        error: error.message,
      });
    });
  });

  describe('ProductController.removeProductImage', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return 400 if the product is not found', async () => {
      const req = {
        body: { productId: '1', images: 'image-url-to-remove.jpg' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Product.findOne.mockResolvedValue(null);

      await ProductController.removeProductImage(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Internal Server Error',
        error: 'Invalid image_url array in database',
      });
    });

    it('should return 500 if image array is invalid', async () => {
      const req = {
        body: { productId: '1', images: 'image-url-to-remove.jpg' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const product = { images: null };

      db.Product.findOne.mockResolvedValue(product);

      await ProductController.removeProductImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        error: 'Invalid image_url array in database',
      });
    });

    it('should return 400 if image URL is not found in product', async () => {
      const req = {
        body: { productId: '1', images: 'image-url-to-remove.jpg' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const product = { images: ['other-image-url.jpg'], save: jest.fn() };

      db.Product.findOne.mockResolvedValue(product);

      await ProductController.removeProductImage(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Bad Request',
        error: 'Image URL not found in product',
      });
    });

    it('should return 200 if image is successfully removed', async () => {
      const req = {
        body: { productId: '1', images: 'image-url-to-remove.jpg' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const product = {
        images: ['image-url-to-remove.jpg', 'another-image-url.jpg'],
        save: jest.fn().mockResolvedValue(undefined),
      };

      db.Product.findOne.mockResolvedValue(product);

      await ProductController.removeProductImage(req, res);

      expect(product.images).toEqual(['another-image-url.jpg']);
      expect(product.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Image removed successfully',
        data: product,
      });
    });

    it('should return 500 if there is a database save error', async () => {
      const req = {
        body: { productId: '1', images: 'image-url-to-remove.jpg' },
      } as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const product = {
        images: ['image-url-to-remove.jpg'],
        save: jest.fn().mockRejectedValue(new Error('Save error')),
      };

      db.Product.findOne.mockResolvedValue(product);

      await ProductController.removeProductImage(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Internal Server Error',
        error: 'Save error',
      });
    });
  });
});
