import cron from 'node-cron';
import sendEmail from '../helps/nodemailer';
import { sendExpiredEmail } from '../helps/MailTemplate';
import { db } from '../database/models/index';

const productExpireTask = cron.schedule('*/3 * * * * *', async () => {
  const productsModels = await db.Product.findAll();
  let expiredProducts: { user: any; products: any[] }[] = [];

  for (const product of productsModels) {
    if (!product.expired && product.expiryDate) {
      const expirationDate = product.expiryDate.getTime();
      const currentTimestamp = Date.now();
      if (currentTimestamp > expirationDate) {
        await product.update({ expired: true });

        const collectionID = await db.Collection.findOne({
          where: { id: product.collectionId },
          include: {
            model: db.User,
            attributes: ['email', 'firstName', 'userId'],
          },
        });
        const seller = collectionID.toJSON().User;
        const existedSeller = expiredProducts.find(
          (exp) => exp.user.userId === seller.userId,
        );

        if (existedSeller) {
          existedSeller.products.push(product.toJSON());
        } else {
          const expiredProduct = { user: seller, products: [product.toJSON()] };
          expiredProducts.push(expiredProduct);
        }
      }
    }
  }
  if (expiredProducts.length > 0) {
    for (let expiredProduct of expiredProducts) {
      const html = sendExpiredEmail(expiredProduct.products);
      await sendEmail(
        expiredProduct.user.email,
        expiredProduct.user.firstName,
        'Product Expiration Notification',
        html,
      );
    }
  }
});

module.exports = { productExpireTask };
