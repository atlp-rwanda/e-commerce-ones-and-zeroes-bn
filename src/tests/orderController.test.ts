import { Request, Response } from 'express';
import { db } from '../database/models';
import OrderController from '../controllers/orderController';
import stripe from '../helps/stripeConfig';

jest.mock('../database/models', () => ({
  db: {
    Cart: {
      findOne: jest.fn(),
      findByPk: jest.fn(),
      create: jest.fn(),
    },
    Product: {
      findOne: jest.fn(),
      findByPk: jest.fn(),
    },
    CartProduct: {
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    },
    Order: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    OrderProduct: {
      create: jest.fn(),
    },
    Address: {
      findByPk: jest.fn(),
    },
  },
}));

jest.mock('../helps/stripeConfig', () => ({
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
  },
}));

describe('OrderController', () => {
  const mockUser: any = {
    userId: '20600b6c-3784-4f3c-b639-f2e44ab77ab7',
  };

  const mockProduct: any = {
    dataValues: {
      productId: '498ad6c8-4482-4380-a0d5-2303568fd497',
      name: 'snickers',
      price: 1500,
      quantity: 500,
      expiryDate: '2024-05-24T10:01:46.219Z',
      expired: false,
      createdAt: '2024-05-24T10:01:46.219Z',
      updatedAt: '2024-05-24T10:01:46.219Z',
    },
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
      cartId: 'null',
      addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
      paymentIntentId: 'pi_3PQWvm02JLx4rKB51nl90QxK',
      updatedAt: '2024-06-11T15:48:18.561Z',
      createdAt: '2024-06-11T15:48:18.561Z',
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
            OrderProduct: {
              dataValues: {
                quantity: 12,
              },
            },
          },
          decrement: function () {
            return 'ok';
          },
        },
      ],
    },
    update: jest.fn(),
  };

  const mockOrderProduct: any = {
    dataValues: {
      orderProductId: '373761a8-0423-49b6-8bae-184aa12a23a9',
      orderId: mockOrder.dataValues.orderId,
      productId: mockProduct.dataValues.productId,
      quantity: 12,
      updatedAt: '2024-06-11T15:48:18.561Z',
      createdAt: '2024-06-11T15:48:18.561Z',
    },
  };

  const mockAddress: any = {
    dataValues: {
      addressId: '918e1e55-3734-495a-98ab-e1901ec0234d',
    },
  };

  describe('createOrder', () => {
    it('should return 400 when missing information', async () => {
      const req = {
        body: {},
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing or Invalid product information',
      });
    });

    it('should return 404 when address does not exist', async () => {
      const req = {
        body: {
          addressId: mockAddress.dataValues.addressId,
          productId: mockProduct.dataValues.productId,
          quantity: 12,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findByPk.mockReturnValue(null);
      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No such address found',
      });
    });

    it('should return 404 when address does not exist', async () => {
      const req = {
        body: {
          addressId: mockAddress.dataValues.addressId,
          productId: mockProduct.dataValues.productId,
          quantity: 12,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findByPk.mockReturnValue(mockAddress);
      db.Product.findByPk.mockReturnValue(null);
      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No such product found',
      });
    });

    it('should return 403 when product quantity is insufficient', async () => {
      const req = {
        body: {
          addressId: mockAddress.dataValues.addressId,
          productId: mockProduct.dataValues.productId,
          quantity: 1200,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findByPk.mockReturnValue(mockAddress);
      db.Product.findByPk.mockReturnValue(mockProduct);
      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Insufficient quantity in stock',
      });
    });

    it('should return 200 when order is created', async () => {
      const req = {
        body: {
          addressId: mockAddress.dataValues.addressId,
          productId: mockProduct.dataValues.productId,
          quantity: 12,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findByPk.mockReturnValue(mockAddress);
      db.Product.findByPk.mockReturnValue(mockProduct);
      stripe.paymentIntents.create = jest
        .fn()
        .mockReturnValue(mockPaymentIntent);
      db.Order.create.mockReturnValue(mockOrder);
      db.OrderProduct.create.mockReturnValue(mockOrderProduct);
      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
    });

    it('should return 500 when stripe error occurs', async () => {
      const req = {
        body: {
          addressId: mockAddress.dataValues.addressId,
          productId: mockProduct.dataValues.productId,
          quantity: 12,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Address.findByPk.mockReturnValue(mockAddress);
      db.Product.findByPk.mockReturnValue(mockProduct);
      stripe.paymentIntents.create = jest.fn().mockImplementation(() => {
        throw new Error('Stripe Error');
      });
      await OrderController.createOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to create order',
      });
    });
  });

  describe('getOrder', () => {
    it('should return 200 when order is retrieved', async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockReturnValue(mockOrder);
      await OrderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ order: mockOrder });
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockReturnValue(null);
      await OrderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockImplementation(() => {
        throw new Error('Database Error');
      });
      await OrderController.getOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get orders',
      });
    });
  });

  describe('confirmOrderPayment', () => {
    it('should return 200 when order is retrieved', async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockReturnValue(mockOrder);
      const successfullPaymentIntent = mockPaymentIntent;
      successfullPaymentIntent.status = 'succeeded';
      db.Cart.findByPk.mockReturnValue(mockCart);
      db.CartProduct.destroy = jest.fn();
      stripe.paymentIntents.retrieve = jest
        .fn()
        .mockReturnValue(successfullPaymentIntent);

      await OrderController.confirmOrderPayment(req, res);

      expect(mockOrder.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order was successfully paid',
      });
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockReturnValue(null);
      await OrderController.confirmOrderPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 404 when paymentIntent', async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockReturnValue(mockOrder);
      stripe.paymentIntents.retrieve = jest.fn().mockReturnValue(null);
      await OrderController.confirmOrderPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No such paymentIntent found',
      });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: mockOrder.dataValues.orderId,
        },
        user: {
          userId: mockUser.userId,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Order.findOne.mockImplementation(() => {
        throw new Error('Database Error');
      });
      await OrderController.confirmOrderPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to confirm payment',
      });
    });
  });
});
