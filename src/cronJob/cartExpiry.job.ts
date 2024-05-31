import dotenv from 'dotenv';
import cron from 'node-cron';
import { db } from '../database/models';
import { Op } from 'sequelize';

dotenv.config();

const schedule: string = process.env.CART_EXPIRY_SCHEDULE
  ? process.env.CART_EXPIRY_SCHEDULE
  : '00 00 00 * * *';

export const cartExpiryJob = cron.schedule(
  schedule,
  async () => {
    try {
      const dateRestriction: Date = new Date(
        Date.now() - 14 * 24 * 60 * 60 * 1000,
      );
      const data = await db.Cart.destroy({
        where: {
          userId: null,
          createdAt: { [Op.lt]: dateRestriction },
        },
      });
      console.log(`Carts: ${data}`);
    } catch (error) {
      console.log(error);
    }
  },
  {
    timezone: 'Africa/Kigali',
  },
);
