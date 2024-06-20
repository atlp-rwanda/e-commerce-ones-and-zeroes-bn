import { db } from '../database/models';
import {
  ProductNotification,
  collectionNotification,
  ProductAvailableNotification,
} from '../utils/notifications/saveToDb';

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      create: jest.fn(),
    },
  },
}));

describe('collectionNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a notification with correct Data', async () => {
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

    await collectionNotification(mockData);

    expect(db.Notifications.create).toHaveBeenCalledWith({
      userId: mockData.userId,
      subject: 'new Collection added',
      body: `your collection ${mockData.collectionName}, was succsessfully created. to continue, add your products`,
      isRead: false,
    });
  });

  it('should log an error if notification creation fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockData = {
      userId: 1,
      collectionName: 'My Collection',
    };
    const mockError = new Error('DB Error');

    db.Notifications.create.mockRejectedValueOnce(mockError);

    await collectionNotification(mockData);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'error creating notification:',
      mockError,
    );

    consoleErrorSpy.mockRestore();
  });
});

describe('productNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a product notification with correct Data', async () => {
    const mockData = {
      userId: 1,
      productName: 'My product',
    };

    const subject = 'new Product added';
    const body = 'body message';

    db.Notifications.create.mockResolvedValueOnce({
      id: 1,
      userId: mockData.userId,
      subject,
      body: `Your product ${mockData.productName}, was succsessfully added to your collection. You are required to make it available for your buyers as soon as you can.`,
      isRead: false,
    });

    await ProductNotification(mockData);

    expect(db.Notifications.create).toHaveBeenCalledWith({
      userId: mockData.userId,
      subject,
      body: `Your product ${mockData.productName}, was succsessfully added to your collection. You are required to make it available for your buyers as soon as you can.`,
      isRead: false,
    });
  });

  it('should log an error if notification creation fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockData = {
      userId: 1,
      productName: 'My Product',
    };
    const mockError = new Error('DB Error');

    db.Notifications.create.mockRejectedValueOnce(mockError);

    await ProductNotification(mockData);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'error creating notification:',
      mockError,
    );

    consoleErrorSpy.mockRestore();
  });
});

describe('productAvailableNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a product available notification with correct Data', async () => {
    const mockData = {
      userId: 1,
      name: 'My product',
      newStatus: 'available',
    };

    const subject = 'Product status changed';
    const body = 'body message';

    db.Notifications.create.mockResolvedValueOnce({
      id: 1,
      userId: mockData.userId,
      subject,
      body: `Status for your product: ${mockData.name} has changed. it's now ${mockData.newStatus}`,
      isRead: false,
    });

    await ProductAvailableNotification(mockData);

    expect(db.Notifications.create).toHaveBeenCalledWith({
      userId: mockData.userId,
      subject,
      body: `Status for your product: ${mockData.name} has changed. it's now ${mockData.newStatus}`,
      isRead: false,
    });
  });

  it('should log an error if notification creation fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockData = {
      userId: 1,
      productName: 'My Product',
    };
    const mockError = new Error('DB Error');

    db.Notifications.create.mockRejectedValueOnce(mockError);

    await ProductAvailableNotification(mockData);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'error creating notification:',
      mockError,
    );

    consoleErrorSpy.mockRestore();
  });
});
