import { db } from '../database/models';
import { saveProductToDbEmitter } from '../utils/notifications/saveProductToDbHandler';

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      create: jest.fn(),
    },
  },
}));

describe('save product', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test(' should save new product to db', async () => {
    const data = {
      product: {
        name: 'dummy',
      },
      productStatus: 'available',
      userInfo: {
        userId: '1',
      },
    };

    const subject = 'new product added';
    const body = `Your product ${data.product.name}, was succsessfully added to your collection. You are required to make it available for your buyers as soon as you can.`;

    db.Notifications.create.mockResolvedValueOnce({
      id: 1,
      userId: data.userInfo.userId,
      subject,
      body: `Your product ${data.product.name}, was succsessfully added to your collection. You are required to make it available for your buyers as soon as you can.`,
      isRead: false,
    });

    await saveProductToDbEmitter.emit('save', data);
    expect(db.Notifications.create).toHaveBeenCalled();
  });
});
