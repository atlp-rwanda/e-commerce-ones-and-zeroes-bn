import { Request, Response } from 'express';
import CartController from '../controllers/cartController';
import { db } from '../database/models';
import stripe from '../helps/stripeConfig';

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
    Order: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    OrderProduct: {
      create: jest.fn(),
    },
  },
}));

jest.mock('../helps/stripeConfig', () => ({
  paymentIntents: {
    create: jest.fn(),
  },
}));

describe('CartController', () => {
  const mockUser: any = {
    userId: '20600b6c-3784-4f3c-b639-f2e44ab77ab7',
  };

  const mockCart: any = {
    dataValues: {
      cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
      userId: mockUser.userId,
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

  const mockPaymentIntent: any = {
    id: 'pi_3PQWvm02JLx4rKB51nl90QxK',
    object: 'payment_intent',
    amount: 18000,
    client_secret:
      'pi_3PQWvm02JLx4rKB51nl90QxK_secret_kBCPpFz4Pd16cm6JLsUSa3ZOn',
    confirmation_method: 'automatic',
    created: 1718120898,
    currency: 'rwf',
    customer: null,
  };

  const mockOrder: any = {
    dataValues: {
      status: 'processing',
      orderId: '68042742-bce8-48e1-b94f-5c87180d8e7b',
      userId: mockUser.userId,
      cartId: mockCart.dataValues.cartId,
      addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
      paymentIntentId: mockPaymentIntent.id,
      updatedAt: '2024-06-11T15:48:18.561Z',
      createdAt: '2024-06-11T15:48:18.561Z',
    },
  };

  const mockOrderProduct: any = {
    dataValues: {
      orderProductId: '373761a8-0423-49b6-8bae-184aa12a23a9',
      orderId: mockOrder.dataValues.orderId,
      productId: '498ad6c8-4482-4380-a0d5-2303568fd497',
      quantity: 12,
      updatedAt: '2024-06-11T15:48:18.561Z',
      createdAt: '2024-06-11T15:48:18.561Z',
    },
  };

  describe('cartCheckout', () => {
    it('should return 400 when missing addressId', async () => {
      const req = {
        params: {
          cartId: mockCart.dataValues.cartId,
        },
        body: {},
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(null);

      await CartController.checkoutCart(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing information' });
    });

    it('should return 404 when cart does not exist', async () => {
      const req = {
        params: {
          cartId: mockCart.dataValues.cartId,
        },
        body: {
          addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.checkoutCart(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such cart found' });
    });

    it('should return 200 when cart is ready for checkout', async () => {
      const req = {
        params: {
          cartId: mockCart.dataValues.cartId,
        },
        body: {
          addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(mockCart);
      stripe.paymentIntents.create = jest
        .fn()
        .mockReturnValue(mockPaymentIntent);
      db.Order.create = jest.fn().mockReturnValue(mockOrder);
      db.OrderProduct.create = jest.fn().mockReturnValue(mockOrderProduct);

      await CartController.checkoutCart(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Cart ready for checkout',
        cart: mockCart,
        order: mockOrder,
        paymentIntent: mockPaymentIntent,
      });
    });

    it('should return 500 when stripe error occurs', async () => {
      const req = {
        params: {
          cartId: mockCart.dataValues.cartId,
        },
        body: {
          addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockReturnValue(mockCart);
      stripe.paymentIntents.create = jest.fn().mockImplementation(() => {
        throw new Error('Error creating payment intent');
      });

      await CartController.checkoutCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to checkout cart products',
      });
    });

    it('should return 500 when database error occurs', async () => {
      const req = {
        params: {
          cartId: mockCart.dataValues.cartId,
        },
        body: {
          addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Cart.findOne = jest.fn().mockImplementation(() => {
        throw new Error('Database Error');
      });

      await CartController.checkoutCart(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to checkout cart products',
      });
    });
  });
});
