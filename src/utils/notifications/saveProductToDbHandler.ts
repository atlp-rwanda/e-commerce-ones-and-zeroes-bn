import { db } from '../../database/models';
import { saveProductToDbEmitter } from './eventEmittersModule';

saveProductToDbEmitter.on('save', async (data: any) => {
  const subject = 'new Product added';
  const body = `Your product ${data.product.name}, was succsessfully added to your collection. You are required to make it available for your buyers as soon as you can.`;
  const save = await db.Notifications.create({
    userId: data.userInfo.userId,
    subject,
    body,
    isRead: false,
  });
});

export { saveProductToDbEmitter };
