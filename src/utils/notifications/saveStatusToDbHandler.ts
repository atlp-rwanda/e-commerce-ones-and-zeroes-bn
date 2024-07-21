import { db } from '../../database/models';
import { saveStatusToDbEmitter } from './eventEmittersModule';

saveStatusToDbEmitter.on('save', async (data: any) => {
  const subject = 'Product status changed';
  const body = `Status for your product: ${data.product.name} has changed. it's now ${data.productStatus}`;
  const save = await db.Notifications.create({
    userId: data.userInfo.userId,
    subject,
    body,
    isRead: false,
  });
});

export { saveStatusToDbEmitter };
