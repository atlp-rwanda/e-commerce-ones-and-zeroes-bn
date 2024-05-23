import express, { Express, Request, Response } from 'express';

import ProductController from '../controllers/productController';
import { db } from '../database/models';
import dotenv from 'dotenv';
dotenv.config();
jest.mock('../database/models', () => ({
  db: {
    ProductMig: {
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
  describe('Get All Products Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 and all products if retrieved successfully', async () => {
      // Arrange
      const req = {} as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const products = [
        { id: 1, name: 'Product 1' },
        { id: 2, name: 'Product 2' },
      ];
  
      jest.spyOn(db.ProductMig, 'findAll').mockResolvedValue(products);
  
      // Act
      await ProductController.getAllProducts(req, res);
  
      // Assert
      expect(db.ProductMig.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Products Retrieved', data: products });
    });
  
    it('should return 500 if an internal server error occurs', async () => {
      // Arrange
      const req = {} as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.ProductMig, 'findAll').mockRejectedValue(new Error('Database Error'));
  
      // Act
      await ProductController.getAllProducts(req, res);
  
      // Assert
      expect(db.ProductMig.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to retrieve products',
        error: 'Database Error',
      });
    });
  });
  describe('Get Single Product Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 and the product if found', async () => {
      // Arrange
      const req = {
        params: { id: '1' },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const product = {
        productId: '1',
        name: 'Product Name',
        description: 'Product Description',
        price: 100,
        quantity: 10,
        discount: '10%',
        expirydate: '2024-01-01',
      };
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
  
      // Act
      await ProductController.getSingleProduct(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Retreived Product',
        data: product,
      });
    });
  
    it('should return 500 if an internal server error occurs', async () => {
      // Arrange
      const req = {
        params: { id: '1' },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.ProductMig, 'findOne').mockRejectedValue(new Error('Database Error'));
  
      // Act
      await ProductController.getSingleProduct(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'fail',
        message: 'Internal server error',
      });
  
    });
  
  });
  describe('updateProduct', () => {
    it('should return 200 if product updated successfully', async () => {
      const req = {
        params: { id: '1' },
        body: {
          name: 'product updated',
          description: 'description updated',
          price: '100',
          quantity: 20,
          discount: '10%',
          expirydate: '2024-07-27',
        },
      } as unknown as Request;
    
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
    
      const product = {
        name: 'original product',
        description: 'original description',
        price: '50',
        quantity: 10,
        discount: '5%',
        expirydate: '2023-07-27',
        save: jest.fn().mockResolvedValue(undefined),
      };
    
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
    
      await ProductController.updateProduct(req, res);
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Product updated successfully',
        data: product,
      });
    
      expect(product.name).toBe(req.body.name);
      expect(product.description).toBe(req.body.description);
      expect(product.price).toBe(req.body.price);
      expect(product.quantity).toBe(req.body.quantity);
      expect(product.discount).toBe(req.body.discount);
      
      expect(product.expirydate).toBe(req.body.expirydate);
      
    });
    it('should return status 500 if there is an error while updating', async () => {
      const req = {
        params: { id: '1' }, // Assuming id '1' for the test
        body: {
          firstName: 'Updated',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
      jest.spyOn(db.ProductMig, 'findOne').mockImplementationOnce(async ()=>{
        throw new Error('Database error');
      })
      await ProductController.updateProduct(req,res)
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Internal Server Error',
        error: 'Database error',
      });
    });
    
  });
  describe('Update Image Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 and update product image successfully', async () => {
      // Arrange
      const req = {
        params: { id: '1' },
        file: { path: 'path_to_image.jpg' },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const product = {
        productId: '1',
        imageurl: ['old_image_url1.jpg', 'old_image_url2.jpg'],
        save: jest.fn().mockResolvedValue(undefined),
      };
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
  
      // Act
      await ProductController.updateImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(product.imageurl).toEqual(['old_image_url1.jpg', 'old_image_url2.jpg', 'path_to_image.jpg']);
      
      expect(product.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'success',
        message: 'Product image updated successfully',
        data: product,
      });
    });
  
    it('should return 404 if product is not found', async () => {
      // Arrange
      const req = {
        params: { id: '1' },
        file: { path: 'path_to_image.jpg' },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(null);
  
      // Act
      await ProductController.updateImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Product not found',
      });
    });
  
    it('should return 400 if maximum number of images is reached', async () => {
      // Arrange
      const req = {
        params: { id: '1' },
        file: { path: 'path_to_image.jpg' },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const product = {
        productId: '1',
        imageurl: ['old_image_url1.jpg', 'old_image_url2.jpg', 'old_image_url3.jpg', 'old_image_url4.jpg', 'old_image_url5.jpg'],
      };
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
  
      // Act
      await ProductController.updateImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'you reached the maximum number of images product must have',
      });
    });
  
    it('should return 500 if an internal server error occurs', async () => {
      // Arrange
      const req = {
        params: { id: '1' },
        file: { path: 'path_to_image.jpg' },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.ProductMig, 'findOne').mockRejectedValue(new Error('Database Error'));
  
      // Act
      await ProductController.updateImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Internal Server Error',
        error: 'Database Error',
      });
    });
  })
  describe('Remove Product Image Controller', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('should return 200 and remove product image successfully', async () => {
      // Arrange
      const req = {
        body: {
          productId: '1',
          imageurl: 'path_to_image.jpg',
        },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const product = {
        productId: '1',
        imageurl: ['path_to_image1.jpg', 'path_to_image2.jpg', 'path_to_image.jpg'],
        save: jest.fn().mockResolvedValue(undefined),
      };
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
  
      // Act
      await ProductController.removeProductImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(product.imageurl).toEqual(['path_to_image1.jpg', 'path_to_image2.jpg']);
      expect(product.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Image removed successfully',
        data: product,
      });
    });
  
    it('should return 404 if product is not found', async () => {
      // Arrange
      const req = {
        body: {
          productId: '1',
          imageurl: 'path_to_image.jpg',
        },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(null);
  
      // Act
      await ProductController.removeProductImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Not Found',
        error: 'Product not found',
      });
    });
  
    it('should return 500 if image_url array in database is invalid', async () => {
      // Arrange
      const req = {
        body: {
          productId: '1',
          imageurl: 'path_to_image.jpg',
        },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const product = {
        productId: '1',
        imageurl: 'invalid_array', // invalid image_url array
      };
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
  
      // Act
      await ProductController.removeProductImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Internal Server Error',
        error: 'Invalid image_url array in database',
      });
    });
  
    it('should return 400 if image URL not found in product', async () => {
      // Arrange
      const req = {
        body: {
          productId: '1',
          imageurl: 'path_to_image.jpg',
        },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      const product = {
        productId: '1',
        imageurl: ['path_to_image1.jpg', 'path_to_image2.jpg'], // Image URL not present
      };
  
      jest.spyOn(db.ProductMig, 'findOne').mockResolvedValue(product);
  
      // Act
      await ProductController.removeProductImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Bad Request',
        error: 'Image URL not found in product',
      });
    });
  
    it('should return 500 if an internal server error occurs', async () => {
      // Arrange
      const req = {
        body: {
          productId: '1',
          imageurl: 'path_to_image.jpg',
        },
      } as unknown as Request;
  
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;
  
      jest.spyOn(db.ProductMig, 'findOne').mockRejectedValue(new Error('Database Error'));
  
      // Act
      await ProductController.removeProductImage(req, res);
  
      // Assert
      expect(db.ProductMig.findOne).toHaveBeenCalledWith({ where: { productId: '1' } });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'Internal Server Error',
        error: 'Database Error',
      });
    });
  })
});
