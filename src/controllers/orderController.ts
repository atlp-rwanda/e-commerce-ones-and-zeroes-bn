import { Request, Response } from 'express';
import { db } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import stripe from '../helps/stripeConfig';
import { createNotification } from '../helps/notificationHelper';

class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
      let expectedDeliveryDate;
      const { productId, quantity, addressId } = req.body;
      if (!productId || !quantity || quantity <= 0 || !addressId) {
        return res
          .status(400)
          .json({ message: 'Missing or Invalid product information' });
      }
      const address = await db.Address.findByPk(addressId);
      if (!address) {
        return res.status(404).json({ message: 'No such address found' });
      }
      const product = await db.Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ message: 'No such product found' });
      }
      if (product.dataValues.quantity < quantity) {
        return res
          .status(403)
          .json({ message: 'Insufficient quantity in stock' });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: product.dataValues.price * quantity,
        currency: 'rwf',
      });

      if (req.body.expectedDeliveryDate) {
        expectedDeliveryDate = new Date(req.body.expectedDeliveryDate);
      } else {
        expectedDeliveryDate = new Date();
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 3);
      }

      const order = await db.Order.create({
        orderId: uuidv4(),
        userId: (req as any).user.userId,
        cartId: null,
        addressId: address.dataValues.addressId,
        paymentIntentId: paymentIntent.id,
        expectedDeliveryDate: expectedDeliveryDate,
      });
      console.log('this is the order', order);
      await db.OrderProduct.create({
        orderProductId: uuidv4(),
        orderId: order.dataValues.orderId,
        productId: product.dataValues.productId,
        quantity: quantity,
      });

      return res.status(200).json({ order });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to create order' });
    }
  }

  static async getOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order: any = await db.Order.findOne({
        where: {
          orderId: orderId,
        },
        include: [
          {
            model: db.Product,
            through: {
              model: db.OrderProduct,
              attributes: ['quantity'],
            },
          },
        ],
      });
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      return res.status(200).json({ order });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to get orders' });
    }
  }

  static async confirmOrderPayment(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order: any = await db.Order.findOne({
        where: {
          orderId: orderId,
        },
        include: [
          {
            model: db.Product,
            through: {
              model: db.OrderProduct,
              attributes: ['quantity'],
            },
          },
        ],
      });
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.dataValues.paymentIntentId,
      );
      if (!paymentIntent) {
        return res.status(404).json({ message: 'No such paymentIntent found' });
      }
      if (paymentIntent.status !== 'succeeded') {
        return res.status(403).json({ message: 'Order was not paid for' });
      }

      //check if order is associated with a cart
      if (order.dataValues.cartId) {
        //clear the cart after checkout
        const cart = await db.Cart.findByPk(order.dataValues.cartId);
        if (!cart) {
          return res.status(404).json({ message: 'No such cart found' });
        }
        await db.CartProduct.destroy({
          where: {
            cartId: cart.dataValues.cartId,
          },
        });
      }
      //update product quantity
      order.dataValues.Products.forEach((product: any) => {
        product.decrement('quantity', {
          by: product.dataValues.OrderProduct.dataValues.quantity,
        });
      });
      //change order payment status
      order.update({ paid: true }, { status: 'processing' });
      await createNotification(
        order.userId,
        'Order Payment Confirmed',
        `Your order payment has been confirmed and is now processing.`,
      );
      return res.status(200).json({ message: 'Order was successfully paid' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to confirm payment' });
    }
  }

  static async getOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      return res.status(200).json({
        status: order.status,
        expectedDeliveryDate: order.expectedDeliveryDate,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to get order status' });
    }
  }

  static async deliverOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      await order.update({ status: 'delivered' });
      // creating a notification
      await createNotification(
        order.userId,
        'Order Delivered',
        'Your order has been delivered.',
      );
      return res.status(200).json({ message: 'Order delivered successfully' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to deliver order' });
    }
  }

  static async cancelOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      await order.update({ status: 'cancelled' });
      await createNotification(
        order.userId,
        'Order Cancelled',
        `Your order has been cancelled.`,
      );
      return res.status(200).json({ message: 'Order cancelled successfully' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to cancel order' });
    }
  }

  static async updateOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const { status, expectedDeliveryDate } = req.body;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      await order.update({ status, expectedDeliveryDate });
      // creating a notification
      await createNotification(
        order.userId,
        'Order Status Updated',
        `Your order status has been updated to ${status}.`,
      );
      return res.status(200).json({
        status: order.status,
        expectedDeliveryDate: order.expectedDeliveryDate,
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to update order status' });
    }
  }

  static async failOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      await order.update({ status: 'failed' });
      await createNotification(
        order.userId,
        'Order Failed',
        `Your order has failed.`,
      );
      return res.status(200).json({ message: 'Order marked as failed' });
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'Failed to mark order as failed' });
    }
  }

  static async refundOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      await order.update({ status: 'refunded' });
      await createNotification(
        order.userId,
        'Order Refunded',
        `Your order has been refunded.`,
      );
      return res.status(200).json({ message: 'Order refunded successfully' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to refund order' });
    }
  }

  static async returnOrder(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const order = await db.Order.findByPk(orderId);
      if (!order) {
        return res.status(404).json({ message: 'No such order found' });
      }
      await order.update({ status: 'returned' });
      await createNotification(
        order.userId,
        'Order Returned',
        `Your order has been returned.`,
      );
      return res.status(200).json({ message: 'Order returned successfully' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to return order' });
    }
  }
}

export default OrderController;
