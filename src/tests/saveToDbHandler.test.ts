import { db } from '../database/models';
import { saveCollectionToDbEmitter } from '../utils/notifications/saveCollectionToDbHandler';

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      create: jest.fn(),
    },
  },
}));

describe('save collection', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('random', async () => {
    const mockData = {
      userId: 1,
      collectionName: 'My Collection',
    };

    const subject = 'subject';
    const body = 'body message';

    db.Notifications.create.mockResolvedValueOnce({
      id: 1,
      userId: mockData.userId,
      subject,
      body: `your collection ${mockData.collectionName}, was succsessfully created. to continue, add your products`,
      isRead: false,
    });

    await saveCollectionToDbEmitter.emit('save', { mockData, subject, body });
    expect(db.Notifications.create).toHaveBeenCalled();
  });
});
