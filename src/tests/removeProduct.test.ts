import { Request, Response } from 'express';
import CartController from '../controllers/cartController';
import dotenv from 'dotenv';
import { db } from '../database/models';

dotenv.config();

jest.mock('../database/models', () => ({
  db: {
    Cart: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    Product: {
      findOne: jest.fn(),
    },
    CartProduct: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('CartController', () => {
  const mockProduct: any = {
    dataValues: {
      productId: '498ad6c8-4482-4380-a0d5-2303568fd497',
      name: 'snickers',
      price: 1500,
      quantity: 500,
      expiry_date: '2024-05-24T10:01:46.219Z',
      createdAt: '2024-05-24T10:01:46.219Z',
      updatedAt: '2024-05-24T10:01:46.219Z',
    },
  };

  const mockAnonymousCart: any = {
    dataValues: {
      cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
      userId: null,
      createdAt: '2024-05-24T10:01:46.219Z',
      updatedAt: '2024-05-24T10:01:46.219Z',
    },
  };

  const mockCartProduct: any = {
    dataValues: {
      cartProductId: '172b2bad-3067-48ad-83b8-aa57e528ca0a',
      cartId: mockAnonymousCart.dataValues.cartId,
      productId: mockProduct.dataValues.productId,
      quantity: 80,
    },
    destroy: () => {
      console.log('deleted');
    },
  };

  describe('removeProduct', () => {
    it('should return error 403 when no cart information is found in a cookie', async () => {
      const req = {
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookies: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.removeProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No cart information found in cookies',
      });
    });

    it('should return error 403 when no valid cart is found in the cookies', async () => {
      const req = {
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(null);

      await CartController.removeProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No valid cart found in cookies',
      });
    });

    it('should return error 404 when no cart associated with this user was found', async () => {
      const req = {
        params: {
          productId: mockProduct.dataValues.productId,
        },
        user: {
          userId: '339a9262-449a-41a6-a505-0488ad38c44b',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(null);

      await CartController.removeProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No cart associated with this user was found',
      });
    });

    it('should return error 403 when product is not found in the cart', async () => {
      const req = {
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne = jest.fn().mockReturnValue(null);

      await CartController.removeProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product was not found in this cart',
      });
    });

    it('should return error 200 when product is successfully removed', async () => {
      const req = {
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Product.findOne = jest.fn().mockReturnValue(mockProduct);

      db.Cart.findOne = jest.fn().mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne = jest.fn().mockReturnValue(mockCartProduct);

      await CartController.removeProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Successfully removed product from cart',
      });
    });

    it('should return error 500 when product database error occurs', async () => {
      const req = {
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne = jest.fn().mockReturnValue({
        ...mockCartProduct,
        destroy: () => {
          throw new Error('Database Error');
        },
      });

      await CartController.removeProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'failed to remove product from cart',
      });
    });
  });
});
