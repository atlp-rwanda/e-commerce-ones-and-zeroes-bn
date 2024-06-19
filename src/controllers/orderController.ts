import { Request, Response } from 'express';
import { db } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import stripe from '../helps/stripeConfig';

class OrderController {
  static async createOrder(req: Request, res: Response) {
    try {
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

      const order = await db.Order.create({
        orderId: uuidv4(),
        userId: (req as any).user.userId,
        cartId: null,
        addressId: address.dataValues.addressId,
        paymentIntentId: paymentIntent.id,
      });

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
      order.update({ paid: true });

      return res.status(200).json({ message: 'Order was successfully paid' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to confirm payment' });
    }
  }
}

export default OrderController;
