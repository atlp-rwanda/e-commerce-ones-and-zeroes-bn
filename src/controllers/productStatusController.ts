import { db } from '../database/models';
import { Request, Response } from 'express';

interface User {
  role: string;
  userproductId: string;
}

interface CustomRequest extends Request {
  user?: User;
  files?: any;
}

export class productController {
  static async getProduct(req: Request, res: Response) {
    try {
      const allProducts = await db.Product.findAll();
      if (!allProducts.length) {
        return res
          .status(404)
          .json({ message: 'No product available in our store' });
      }
      res
        .status(200)
        .json({ message: 'We have these products in our store', allProducts });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getAvailableProduct(req: Request, res: Response) {
    try {
      const allAvailableProducts = await db.Product.findAll({
        where: {
          isAvailable: true,
        },
      });
      if (!allAvailableProducts.length) {
        return res
          .status(404)
          .json({ message: 'No available products in our store' });
      }
      res.status(200).json({
        message: 'List of available products in our store',
        allAvailableProducts,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getSingleProduct(req: Request, res: Response) {
    try {
      const singleProduct = await db.Product.findOne({
        where: {
          productId: req.params.productId,
        },
      });

      if (!singleProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json({ singleProduct });
    } catch (error) {
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async updateSingleProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      if (!productId) {
        return res
          .status(400)
          .json({ message: 'Product productId is required' });
      }

      const product = await db.Product.findOne({ where: { productId } });

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const newStatus = !product.isAvailable;

      await db.Product.update(
        { isAvailable: newStatus },
        { where: { productId } },
      );

      res.status(200).json({
        message: `Product is successfully marked as ${newStatus ? 'available' : 'unavailable'}`,
        isAvailable: newStatus,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
