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
    },
  },
}));

describe('CartController', () => {
  const mockCart: any = {
    dataValues: {
      cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
      userId: null,
      createdAt: '2024-05-26T20:14:26.002Z',
      updatedAt: '2024-05-26T20:14:23.080Z',
      Products: [
        {
          dataValues: {
            productId: '498ad6c8-4482-4380-a0d5-2303568fd497',
            name: 'snickers',
            price: 1500,
            quantity: 500,
            expiryDate: '2024-05-24T10:01:46.219Z',
            expired: false,
            createdAt: '2024-05-24T10:01:46.219Z',
            updatedAt: '2024-05-24T10:01:46.219Z',
            CartProduct: {
              dataValues: {
                quantity: 12,
              },
            },
          },
        },
      ],
    },
  };

  describe('getCartProducts', () => {
    it('should return 200 and empty cart when no cart information is in the cookie', async () => {
      const req = {
        cookies: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.getCartProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: {}, total: 0 });
    });

    it('should return 200 and empty cart when no valid cart is in the cookie', async () => {
      const req = {
        cookies: {
          cartId: mockCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(null);

      await CartController.getCartProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: {}, total: 0 });
    });

    it('should return 200 when valid cart is in the cookie', async () => {
      const req = {
        cookies: {
          cartId: mockCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(mockCart);

      await CartController.getCartProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: mockCart,
        total: 18000,
      });
    });

    it('should return 200 and empty cart data when no cart is associated with the user', async () => {
      const req = {
        user: {
          userId: '0c3cb46d-b870-403f-a35c-f51ad5a72bd8',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      let registeredUserCart: any = mockCart;
      registeredUserCart.dataValues.userId =
        '0c3cb46d-b870-403f-a35c-f51ad5a72bd8';
      db.Cart.findOne.mockReturnValue(null);

      await CartController.getCartProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: {}, total: 0 });
    });

    it('should return 200 and the cart data associated with the user', async () => {
      const req = {
        user: {
          userId: '0c3cb46d-b870-403f-a35c-f51ad5a72bd8',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      let registeredUserCart: any = mockCart;
      registeredUserCart.dataValues.userId =
        '0c3cb46d-b870-403f-a35c-f51ad5a72bd8';
      db.Cart.findOne.mockReturnValue(registeredUserCart);

      await CartController.getCartProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: registeredUserCart,
        total: 18000,
      });
    });

    it('should return 500 when product database error occurs', async () => {
      const req = {
        cookies: {
          cartId: mockCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockImplementation(() => {
        throw new Error('Database Error');
      });

      await CartController.getCartProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get cart products',
      });
    });
  });
});
