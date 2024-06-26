import { Request, Response } from 'express';
import CartController from '../../controllers/cartController';
import dotenv from 'dotenv';
import { db } from '../../database/models';

dotenv.config();

jest.mock('../../database/models', () => ({
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
      destroy: jest.fn(),
    },
  },
}));

describe('CartController', () => {
  const mockAnonymousCart: any = {
    dataValues: {
      cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
      userId: null,
      createdAt: '2024-05-24T10:01:46.219Z',
      updatedAt: '2024-05-24T10:01:46.219Z',
    },
  };

  describe('clearCart', () => {
    it('should return error 403 when no cart information is found in a cookie', async () => {
      const req = {
        cookies: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No cart information found in cookies',
      });
    });

    it('should return error 403 when no valid cart is found in the cookies', async () => {
      const req = {
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(null);

      await CartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No valid cart found in cookies',
      });
    });

    it('should return error 404 when no cart associated with this user was found', async () => {
      const req = {
        user: {
          userId: '339a9262-449a-41a6-a505-0488ad38c44b',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(null);

      await CartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No cart associated with this user was found',
      });
    });

    it('should return error 200 when cart is cleared', async () => {
      const req = {
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.destroy.mockReturnValue([1]);

      await CartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cart was cleared successfully',
      });
    });

    it('should return error 500 when product database error occurs', async () => {
      const req = {
        cookies: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.destroy.mockImplementation(() => {
        throw new Error('Database Error');
      });

      await CartController.clearCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to clear cart',
      });
    });
  });
});
