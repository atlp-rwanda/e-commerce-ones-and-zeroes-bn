import * as dbModels from '../database/models';
import * as notificationHelper from '../helps/notificationHelper';

jest.mock('../database/models', () => ({
  db: {
    Notifications: {
      create: jest.fn(),
    },
    User: {
      findByPk: jest.fn(),
    },
  },
}));

jest
  .spyOn(notificationHelper, 'sendEmailNotification')
  .mockImplementation(() => Promise.resolve());

describe('notificationHelper', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not send an email if user email is not defined', async () => {
    const userId = 'mockUserId';
    const subject = 'mockSubject';
    const body = 'mockBody';

    const mockUser = {
      email: undefined,
    };

    (dbModels.db.User.findByPk as jest.Mock).mockResolvedValueOnce(mockUser);

    await notificationHelper.createNotification(userId, subject, body);

    expect(dbModels.db.Notifications.create).toHaveBeenCalledWith({
      notificationId: expect.any(String),
      userId,
      subject,
      body,
      isRead: false,
    });

    expect(dbModels.db.User.findByPk).toHaveBeenCalledWith(userId);

    expect(notificationHelper.sendEmailNotification).not.toHaveBeenCalled();
  });
});
