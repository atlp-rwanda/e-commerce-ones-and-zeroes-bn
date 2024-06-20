import { db } from '../../database/models';

const collectionNotification = async (data: any) => {
  try {
    const subject = 'new Collection added';
    const body = `your collection ${data.collectionName}, was succsessfully created. to continue, add your products`;
    const save = await db.Notifications.create({
      userId: data.userId,
      subject,
      body,
      isRead: false,
    });
  } catch (e) {
    console.error('error creating notification:', e);
  }
};

const ProductNotification = async (data: any) => {
  try {
    const subject = 'new Product added';
    const body = `Your product ${data.productName}, was succsessfully added to your collection. You are required to make it available for your buyers as soon as you can.`;
    const save = await db.Notifications.create({
      userId: data.userId,
      subject,
      body,
      isRead: false,
    });
  } catch (e) {
    console.error('error creating notification:', e);
  }
};

const ProductAvailableNotification = async (data: any) => {
  try {
    const subject = 'Product status changed';
    const body = `Status for your product: ${data.name} has changed. it's now ${data.newStatus}`;
    const save = await db.Notifications.create({
      userId: data.userId,
      subject,
      body,
      isRead: false,
    });
  } catch (e) {
    console.error('error creating notification:', e);
  }
};

export {
  collectionNotification,
  ProductNotification,
  ProductAvailableNotification,
};
