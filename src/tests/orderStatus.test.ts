import { Request, Response } from 'express';
import OrderController from '../controllers/orderController';
import { db } from '../database/models';

jest.mock('../database/models', () => ({
  db: {
    Order: {
      findByPk: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('OrderController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOrderStatus', () => {
    it('should return 200 when order status is retrieved', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        status: 'mockStatus',
        expectedDeliveryDate: 'mockDate',
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.getOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockOrder); // Updated this line
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.getOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.getOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to get order status',
      });
    });
  });

  describe('deliverOrder', () => {
    it('should return 200 when order is delivered', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        update: jest.fn(),
        userId: 'mockUserId',
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.deliverOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order delivered successfully',
      });
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.deliverOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.deliverOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to deliver order',
      });
    });
  });

  describe('cancelOrder', () => {
    it('should return 200 when order is cancelled', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        update: jest.fn(),
        userId: 'mockUserId',
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.cancelOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order cancelled successfully',
      });
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.cancelOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.cancelOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to cancel order',
      });
    });
  });

  describe('updateOrderStatus', () => {
    it('should return 200 when order status is updated', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
        body: {
          status: 'mockStatus',
          expectedDeliveryDate: 'mockDate',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        status: undefined,
        expectedDeliveryDate: undefined,
        update: jest.fn().mockImplementation(function (this: any, values: any) {
          Object.assign(this, values);
        }),
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: req.body.status,
        expectedDeliveryDate: req.body.expectedDeliveryDate,
      }); // Updated this line
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
        body: {
          status: 'mockStatus',
          expectedDeliveryDate: 'mockDate',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
        body: {
          status: 'mockStatus',
          expectedDeliveryDate: 'mockDate',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.updateOrderStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to update order status',
      });
    });
  });

  describe('failOrder', () => {
    it('should return 200 when order is failed', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        update: jest.fn(),
        userId: 'mockUserId',
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.failOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order marked as failed',
      }); // Updated this line
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.failOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.failOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to mark order as failed',
      });
    });
  });

  describe('refundOrder', () => {
    it('should return 200 when order is refunded', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        update: jest.fn(),
        userId: 'mockUserId',
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.refundOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order refunded successfully',
      });
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.refundOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.refundOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to refund order',
      });
    });
  });

  describe('returnOrder', () => {
    it('should return 200 when order is returned', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const mockOrder = {
        update: jest.fn(),
        userId: 'mockUserId',
      };

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(mockOrder);

      await OrderController.returnOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Order returned successfully',
      });
    });

    it("should return 404 when order doesn't exist", async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockResolvedValueOnce(null);

      await OrderController.returnOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'No such order found' });
    });

    it('should return 500 when error occurs', async () => {
      const req = {
        params: {
          orderId: 'mockOrderId',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Order.findByPk as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Database Error');
      });

      await OrderController.returnOrder(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Failed to return order',
      });
    });
  });
});
