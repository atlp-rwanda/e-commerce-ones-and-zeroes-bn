import { db } from '../database/models';
import { Op } from 'sequelize';
import { Request, Response } from 'express';

export class SearchController {
  static async search(req: Request, res: Response) {
    try {
      const { searchKeyword } = req.query;
      if (!searchKeyword) {
        const products = await db.Product.findAll({
          where: {
            expired: false,
          },
        });
        if (products <= 0) {
          return res.status(404).json({ message: 'no Products in store' });
        }
        return res.status(200).json(products);
      }

      const minPrice = req.query.minPrice
        ? Number(req.query.minPrice)
        : undefined;
      const maxPrice = req.query.maxPrice
        ? Number(req.query.maxPrice)
        : undefined;

      //search conditions
      const searchConditions: any = {
        [Op.or]: [
          { name: { [Op.iLike]: `%${searchKeyword}%` } },
          { category: { [Op.iLike]: `%${searchKeyword}%` } },
        ],
      };

      // Add price range filtering if applicable
      if (minPrice !== undefined || maxPrice !== undefined) {
        searchConditions.price = {};
        if (minPrice !== undefined) {
          searchConditions.price[Op.gte] = minPrice;
        }
        if (maxPrice !== undefined) {
          searchConditions.price[Op.lte] = maxPrice;
        }
      }
      const productSearched = await db.Product.findAll({
        where: searchConditions,
      });

      if (!productSearched) {
        const products = await db.Product.findAll({});
        if (products <= 0) {
          return res.status(404).json({ message: 'no Products in store' });
        }
        return res.status(200).json({ data: products });
      }
      res.status(200).json({ data: productSearched });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', error });
    }
  }
}
