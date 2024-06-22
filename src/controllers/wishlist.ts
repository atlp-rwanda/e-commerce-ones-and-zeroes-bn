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
      const product = await Product.findOne({
        where: { productId: productId },
      });
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const existingWishlistItem = await Wishlist.findOne({
        where: { userId, productId },
      });
      if (existingWishlistItem) {
        return res
          .status(400)
          .json({ message: 'Product already in your wishlist' });
      }
      const wishlistItem = await Wishlist.create({ userId, productId });
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
      const wishlistItem = await Wishlist.findOne({
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
      const wishlists = await Wishlist.findAll({
        where: { userId },
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['name', 'price'],
          },
        ],
      });
      if (!wishlists.length) {
        return res.status(200).json([]);
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
      await Wishlist.destroy({ where: { userId } });
      return res.status(200).json({ message: 'Wishlist cleared successfully' });
    } catch (error: any) {
      return res.status(500).json({
        message: 'Failed to clear wishlist',
        error: error.message,
      });
    }
  }
}
