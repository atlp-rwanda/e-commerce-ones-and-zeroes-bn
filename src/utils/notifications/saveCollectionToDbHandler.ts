import { db } from '../../database/models';
import { saveCollectionToDbEmitter } from './eventEmittersModule';

saveCollectionToDbEmitter.on('save', async (data: any) => {
  const subject = 'new Collection added';
  const body = `your collection ${data.collectionName} was succsessfully created. to continue, add your products`;
  const save = await db.Notifications.create({
    userId: data.userId,
    subject,
    body,
    isRead: false,
  });
});

export { saveCollectionToDbEmitter };
