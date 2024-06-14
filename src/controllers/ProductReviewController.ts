import { Request, Response } from 'express';
import { db } from '../database/models';
import { where } from 'sequelize';
import validateProductReview from '../validations/validateProductReview';

interface User {
  userId: string;
}

interface CustomRequest extends Request {
  user?: User;
}
interface Review {
  reviewComment: string;
  rating: number;
}

export default class ProductReviewController {
  static async Review(req: CustomRequest, res: Response) {
    validateProductReview(req.body as Review);
    const user = (req as any).user;
    try {
      const foundUser = await db.User.findOne({
        where: { userId: user.userId },
      });

      if (!foundUser) {
        return res.status(404).json({
          message: 'user with the given Id is not found',
        });
      }
      const foundProduct = await db.Product.findOne({
        where: { productId: req.params.id },
      });
      if (!foundProduct) {
        return res.status(404).json({
          message: 'product with the given id not found',
        });
      }
      const AlreadyReviewed = await db.ProductReview.findOne({
        where: { userId: foundUser.userId },
      });
      if (AlreadyReviewed) {
        return res.status(401).json({
          message: 'you can review a product only once',
        });
      }
      const ProductReview = await db.ProductReview.create({
        productId: req.params.id,
        userId: foundUser.userId,
        reviewComment: req.body.reviewComment,
        rating: req.body.rating,
      });
      return res.status(200).json({
        message: 'review recorded successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  static async editReview(req: CustomRequest, res: Response) {
    validateProductReview(req.body as Review);
    const user = (req as any).user;
    try {
      const foundUser = await db.User.findOne({
        where: { userId: user.userId },
      });
      if (!foundUser) {
        return res.status(404).json({
          message: 'user with the given id not found',
        });
      }
      let foundReview = await db.ProductReview.findOne({
        where: { userId: foundUser.userId, productId: req.params.id },
      });
      if (!foundReview) {
        return res.status(404).json({
          message: 'review not found for the given product by the user',
        });
      }
      foundReview = await foundReview.update({
        rating: req.body.rating,
        reviewComment: req.body.reviewComment,
      });
      return res.status(200).json({
        message: 'Review updated successfully',
        review: foundReview,
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteReview(req: CustomRequest, res: Response) {
    const user = (req as any).user;
    try {
      const foundUser = await db.User.findOne({
        where: { userId: user.userId },
      });
      if (!foundUser) {
        return res.status(404).json({
          message: 'user with the given id not found',
        });
      }
      const foundReview = await db.ProductReview.findOne({
        where: { userId: foundUser.userId, productId: req.params.id },
      });
      if (!foundReview) {
        return res.status(404).json({
          message: 'review not found for the given product by the user',
        });
      }
      await foundReview.destroy();
      return res.status(200).json({
        message: 'Review deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  static async deleteAllReviews(req: CustomRequest, res: Response) {
    try {
      const foundProduct = await db.Product.findOne({
        where: { productId: req.params.id },
      });
      if (!foundProduct) {
        return res.status(404).json({
          message: 'product with the given id not found',
        });
      }
      await db.ProductReview.destroy({
        where: { productId: req.params.id },
      });
      return res.status(200).json({
        message: 'All reviews deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message,
      });
    }
  }

  static async getAllReviews(req: CustomRequest, res: Response) {
    try {
      const foundProduct = await db.Product.findOne({
        where: { productId: req.params.id },
      });
      if (!foundProduct)
        return res.status(404).json({
          message: 'Product with the given id not found',
        });
      const reviews = await db.ProductReview.findAll({
        where: { productId: foundProduct.productId },
      });
      if (reviews.length === 0)
        return res.status(404).json({
          message: 'this product has no reviews',
        });
      return res.status(200).json({
        message: 'reviews retrieved successfully',
        data: reviews,
      });
    } catch (error) {
      return res.status(500).json({
        message: 'server error',
      });
    }
  }
}
