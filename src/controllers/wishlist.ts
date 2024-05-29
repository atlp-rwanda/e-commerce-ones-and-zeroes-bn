import { Request, Response } from 'express';
import { db } from '../database/models';

const { Wishlist, User, Product } = db;

export default class WishlistController {
  static async addToWishlist(req: Request, res: Response): Promise<Response> {
    try {
      const productId = req.params.productId;
      const userId = res.locals.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      //produt exist
      const product = await db.Product.findOne({ where: { productId } });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const existingWishlistItem = await db.Wishlist.findOne({
        where: { userId, productId },
      });
      if (existingWishlistItem) {
        return res
          .status(400)
          .json({ message: 'Product already in your wishlist' });
      }

      // Add
      const wishlistItem = await db.Wishlist.create({ userId, productId });

      return res.status(201).json({
        message: 'Product added to your wishlist',
        wishlistItem,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: 'Failed to add product to wishlist',
        error: error.message,
      });
    }
  }
  static async deleteFromWishlist(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const userId = res.locals.userId;
      const productId = req.params.productId;

      if (!userId || !productId) {
        return res.status(404).json({ message: 'Product ID is required' });
      }

      const wishlistItem = await db.Wishlist.findOne({
        where: { userId, productId },
      });

      if (!wishlistItem) {
        return res.status(404).json({ message: 'Wishlist item not found' });
      }

      await wishlistItem.destroy();

      return res
        .status(200)
        .json({ message: 'Product removed from your wishlist' });
    } catch (error: any) {
      return res.status(500).json({
        message: 'Failed to remove product from wishlist',
        error: error.message,
      });
    }
  }
  static async getWishlist(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;

      const wishlists = await db.Wishlist.findAll({
        where: { userId },
        include: [
          {
            model: db.Product,
            as: 'product',
            attributes: ['name', 'price'],
          },
        ],
      });
      if (!wishlists.length) {
        return res.status(200).json({ message: 'no items in your wishlist' });
      }

      return res.status(200).json(wishlists);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  static async clearWishlist(req: Request, res: Response): Promise<Response> {
    try {
      const userId = res.locals.userId;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      await db.Wishlist.destroy({ where: { userId } });

      return res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error: any) {
      return res.status(500).json({
        message: 'Failed to clear wishlist',
        error: error.message,
      });
    }
  }
}
