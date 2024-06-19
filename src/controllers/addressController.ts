import { db } from '../database/models';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

class AddressController {
  static async getUserAddress(req: Request, res: Response) {
    try {
      const address = await db.Address.findOne({
        where: {
          userId: (req as any).user.userId,
        },
      });
      if (!address) {
        return res.status(404).json({ message: 'No address found' });
      }
      return res.status(200).json({ data: address });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to get user address' });
    }
  }

  static async addAddress(req: Request, res: Response) {
    try {
      const { country, province, district, sector, street } = req.body;
      if (!country || !province || !district || !sector || !street) {
        return res.status(400).json({ message: 'Missing Address Information' });
      }
      const address = await db.Address.findOne({
        where: {
          userId: (req as any).user.userId,
        },
      });

      if (address) {
        return res.status(403).json({ message: 'User address already exists' });
      }

      const newAddress = await db.Address.create({
        addressId: uuidv4(),
        userId: (req as any).user.userId,
        country,
        province,
        district,
        sector,
        street,
      });
      return res
        .status(200)
        .json({ message: 'Address added', data: newAddress });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to add address' });
    }
  }

  static async updateAddress(req: Request, res: Response) {
    try {
      const { country, province, district, sector, street } = req.body;
      if (!country || !province || !district || !sector || !street) {
        return res.status(400).json({ message: 'Missing Address Information' });
      }
      const address = await db.Address.findOne({
        where: {
          userId: (req as any).user.userId,
        },
      });
      if (!address) {
        return res.status(404).json({ message: 'No address found' });
      }
      await address.update({ country, province, district, sector, street });
      return res
        .status(200)
        .json({ message: 'Address updated', data: address });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to update address' });
    }
  }

  static async deleteAddress(req: Request, res: Response) {
    try {
      const address = await db.Address.findOne({
        where: {
          userId: (req as any).user.userId,
        },
      });
      if (!address) {
        return res.status(404).json({ message: 'No address found' });
      }
      await address.destroy();
      return res.status(200).json({ message: 'Address deleted' });
    } catch (err) {
      return res.status(500).json({ message: 'Failed to delete address' });
    }
  }
}

export default AddressController;
