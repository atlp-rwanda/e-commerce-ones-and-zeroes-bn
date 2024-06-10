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
      update: jest.fn(),
    },
  },
}));

describe('CartController', () => {
  const mockUser: any = {
    userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
    firstName: 'christian',
    lastName: 'Ishimwe',
    email: 'christianinjoooa3@gmail.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-05-06T18:17:45.933Z',
    updatedAt: '2024-05-06T18:17:45.933Z',
  };

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
  };

  describe('updateCartProduct', () => {
    it('should return error 400 product information is missing', async () => {
      const req = {
        body: {},
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookie: {
          cartId: mockAnonymousCart.dataValues.cartId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing or invalid product quantity',
      });
    });

    it('should return error 403 when no cart information is found in a cookie', async () => {
      const req = {
        body: {
          quantity: 10,
        },
        params: {
          productId: mockProduct.dataValues.productId,
        },
        cookies: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No cart information found in cookies',
      });
    });

    it('should return error 403 when no valid cart is found in the cookies', async () => {
      const req = {
        body: {
          quantity: 10,
        },
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

      db.Cart.findOne.mockReturnValue(null);

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No valid cart found in cookies',
      });
    });

    it('should return error 404 when no cart associated with this user was found', async () => {
      const req = {
        body: {
          quantity: 10,
        },
        params: {
          productId: mockProduct.dataValues.productId,
        },
        user: mockUser,
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne.mockReturnValue(null);

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No cart associated with this user was found',
      });
    });

    it("should return error 404 when product doesn't exist", async () => {
      const req = {
        body: {
          quantity: 100,
        },
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

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.Product.findOne.mockReturnValue(null);

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No such product found',
      });
    });

    it('should return error 403 when product is not found in the cart', async () => {
      const req = {
        body: {
          quantity: 1000,
        },
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

      db.Product.findOne.mockReturnValue(mockProduct);

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne.mockReturnValue(null);

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product was not found in this cart',
      });
    });

    it('should return error 403 when product quantity is insufficient', async () => {
      const req = {
        body: {
          quantity: 1000,
        },
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

      let product = mockProduct;
      product.dataValues.quantity = 50;
      db.Product.findOne.mockReturnValue(product);

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne.mockReturnValue(mockCartProduct);

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Insufficient quantity in stock',
      });
    });

    it('should return error 200 when product quantity is successfully updated', async () => {
      const req = {
        body: {
          quantity: 10,
        },
        params: {
          productId: mockProduct.dataValues.productId,
        },
        user: mockUser,
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Product.findOne.mockReturnValue(mockProduct);

      let cart: any = mockAnonymousCart;
      cart.dataValues.userId = (req as any).user.userId;
      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne.mockReturnValue(mockCartProduct);

      db.CartProduct.update.mockReturnValue([1]);

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cart Product was successfully updated',
      });
    });

    it('should return error 500 when product database error occurs', async () => {
      const req = {
        body: {
          quantity: 10,
        },
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

      db.Product.findOne.mockReturnValue(mockProduct);

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne.mockReturnValue(mockCartProduct);

      db.CartProduct.update.mockImplementation(() => {
        throw new Error('Database error');
      });

      await CartController.updateCartProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update product',
      });
    });
  });
});
