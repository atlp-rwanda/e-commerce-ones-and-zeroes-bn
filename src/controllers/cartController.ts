import { Request, Response } from 'express';
import { db } from '../database/models';
import { v4 as uuidv4 } from 'uuid';

export default class CartController {
  static async getCartProducts(req: Request, res: Response) {
    try {
      let cart: any;
      if (!(req as any).user) {
        let cartId = req.cookies?.cartId;
        if (!cartId) {
          return res.status(200).json({ data: {}, total: 0 });
        } else {
          cart = await db.Cart.findOne({
            where: {
              cartId: cartId,
            },
            include: [
              {
                model: db.Product,
                through: {
                  model: db.CartProduct,
                  attributes: ['quantity'],
                },
              },
            ],
          });
          if (!cart) {
            return res.status(200).json({ data: {}, total: 0 });
          }
        }
      } else {
        cart = await db.Cart.findOne({
          where: {
            userId: (req as any).user.userId,
          },
          include: [
            {
              model: db.Product,
              through: {
                model: db.CartProduct,
                attributes: ['quantity'],
              },
            },
          ],
        });
        if (!cart) {
          return res.status(200).json({ data: {}, total: 0 });
        }
      }

      const total = cart.dataValues.Products.reduce(
        (accumulator: number, product: any): number => {
          return (
            accumulator +
            product.dataValues.price *
              product.dataValues.CartProduct.dataValues.quantity
          );
        },
        0,
      );

      return res.status(200).json({ data: cart, total });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to get cart products' });
    }
  }

  static async addProduct(req: Request, res: Response) {
    try {
      let cart: any;
      const { productId, quantity } = req.body;
      if (
        !productId ||
        !quantity ||
        typeof quantity !== 'number' ||
        quantity <= 0
      ) {
        return res
          .status(400)
          .json({ message: 'Missing or invalid product information' });
      }
      // check if the product exists
      const product = await db.Product.findOne({
        where: {
          productId: productId,
        },
      });
      if (!product) {
        return res.status(404).json({ message: 'No such product found' });
      }
      //check if user is logged in
      if (!(req as any).user) {
        let cartId = req.cookies?.cartId;
        if (!cartId) {
          cart = await db.Cart.create({ cartId: uuidv4(), userId: null });
          //set the cookie
          res.cookie('cartId', cart.dataValues.cartId);
          cartId = cart.dataValues.cartId;
        } else {
          //check if there is a cart associated with the cartId from the cookie
          cart = await db.Cart.findOne({
            where: {
              cartId: cartId,
            },
          });
          //if no cart exists create one
          if (!cart) {
            cart = await db.Cart.create({ cartId: uuidv4(), userId: null });
            //set a new cookie
            res.cookie('cartId', cart.dataValues.cartId);
          }
        }
      } else {
        //if user is logged in
        cart = await db.Cart.findOne({
          where: {
            userId: (req as any).user.userId,
          },
        });
        if (!cart) {
          cart = await db.Cart.create({
            cartId: uuidv4(),
            userId: (req as any).user.userId,
          });
        }
      }

      const cartProduct = await db.CartProduct.findOne({
        where: { cartId: cart.dataValues.cartId, productId: productId },
      });

      if (cartProduct) {
        return res
          .status(403)
          .json({ message: 'Product is already in the cart' });
      }

      if (product.dataValues.quantity < quantity) {
        return res
          .status(403)
          .json({ message: 'Insufficient quantity in stock' });
      }

      const data = await db.CartProduct.create({
        cartProductId: uuidv4(),
        cartId: cart.dataValues.cartId,
        productId: productId,
        quantity: quantity,
      });

      return res
        .status(200)
        .json({ message: 'Product added to cart successfully', data });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: 'Failed to add product to cart' });
    }
  }

  static async updateCartProduct(req: Request, res: Response) {
    try {
      let cart: any;
      const { productId } = req.params;
      const { quantity } = req.body;
      if (!quantity || typeof quantity !== 'number' || quantity <= 0) {
        return res
          .status(400)
          .json({ message: 'Missing or invalid product quantity' });
      }
      if (!(req as any).user) {
        let cartId = req.cookies?.cartId;
        if (!cartId) {
          return res
            .status(403)
            .json({ message: 'No cart information found in cookies' });
        } else {
          cart = await db.Cart.findOne({
            where: {
              cartId: cartId,
            },
          });
          if (!cart) {
            return res
              .status(403)
              .json({ message: 'No valid cart found in cookies' });
          }
        }
      } else {
        cart = await db.Cart.findOne({
          where: {
            userId: (req as any).user.userId,
          },
        });
        if (!cart) {
          return res
            .status(404)
            .json({ message: 'No cart associated with this user was found' });
        }
      }
      const product = await db.Product.findOne({
        where: {
          productId: productId,
        },
      });
      if (!product) {
        return res.status(404).json({ message: 'No such product found' });
      }
      const cartProduct = await db.CartProduct.findOne({
        where: {
          cartId: cart.dataValues.cartId,
          productId: productId,
        },
      });
      if (!cartProduct) {
        return res
          .status(403)
          .json({ message: 'Product was not found in this cart' });
      }
      if (product.dataValues.quantity < quantity) {
        return res
          .status(403)
          .json({ message: 'Insufficient quantity in stock' });
      }
      await db.CartProduct.update(
        {
          quantity: quantity,
        },
        {
          where: {
            cartId: cart.dataValues.cartId,
            productId: productId,
          },
        },
      );

      return res
        .status(200)
        .json({ message: 'Cart Product was successfully updated' });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to update product' });
    }
  }

  static async removeProduct(req: Request, res: Response) {
    try {
      let cart: any;
      const { productId } = req.params;
      if (!(req as any).user) {
        let cartId = req.cookies?.cartId;
        if (!cartId) {
          return res
            .status(403)
            .json({ message: 'No cart information found in cookies' });
        } else {
          cart = await db.Cart.findOne({
            where: {
              cartId: cartId,
            },
          });
          if (!cart) {
            return res
              .status(403)
              .json({ message: 'No valid cart found in cookies' });
          }
        }
      } else {
        cart = await db.Cart.findOne({
          where: {
            userId: (req as any).user.userId,
          },
        });
        if (!cart) {
          return res
            .status(404)
            .json({ message: 'No cart associated with this user was found' });
        }
      }
      const cartProduct = await db.CartProduct.findOne({
        where: {
          cartId: cart.dataValues.cartId,
          productId: productId,
        },
      });
      if (!cartProduct) {
        return res
          .status(403)
          .json({ message: 'Product was not found in this cart' });
      }
      await cartProduct.destroy();
      return res
        .status(200)
        .json({ message: 'Successfully removed product from cart' });
    } catch (error: any) {
      console.log(error);
      return res
        .status(500)
        .json({ message: 'failed to remove product from cart' });
    }
  }

  static async clearCart(req: Request, res: Response) {
    try {
      let cart: any;
      if (!(req as any).user) {
        let cartId = req.cookies?.cartId;
        if (!cartId) {
          return res
            .status(403)
            .json({ message: 'No cart information found in cookies' });
        } else {
          cart = await db.Cart.findOne({
            where: {
              cartId: cartId,
            },
          });
          if (!cart) {
            return res
              .status(403)
              .json({ message: 'No valid cart found in cookies' });
          }
        }
      } else {
        cart = await db.Cart.findOne({
          where: {
            userId: (req as any).user.userId,
          },
        });
        if (!cart) {
          return res
            .status(404)
            .json({ message: 'No cart associated with this user was found' });
        }
      }

      await db.CartProduct.destroy({
        where: {
          cartId: cart.dataValues.cartId,
        },
      });
      return res.status(200).json({ message: 'Cart was cleared successfully' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to clear cart' });
    }
  }
}
