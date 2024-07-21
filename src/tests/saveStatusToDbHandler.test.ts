import { db } from '../database/models';
import { saveStatusToDbEmitter } from '../utils/notifications/saveStatusToDbHandler';

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      create: jest.fn(),
    },
  },
}));

describe('save Status', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('random', async () => {
    const mockData = {
      userId: 1,
      collectionName: 'My Collection',
    };

    const data = {
      product: {
        name: 'dummy',
      },
      productStatus: 'available',
      userInfo: {
        userId: '1',
      },
    };

    const subject = 'subject';
    const body = 'body message';

    db.Notifications.create.mockResolvedValueOnce({
      id: 1,
      userId: mockData.userId,
      subject,
      body: `Status for your product: ${data.product.name} has changed. it's now ${data.productStatus}`,
      isRead: false,
    });

    await saveStatusToDbEmitter.emit('save', data);
    expect(db.Notifications.create).toHaveBeenCalled();
  });
});
