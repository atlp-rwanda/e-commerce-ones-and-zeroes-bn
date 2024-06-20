import { db } from '../database/models';
import { addCollectionEmitter } from '../utils/notifications/eventEmittersModule';
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('addCollection', () => {
  let sendMailMock: any;

  beforeAll(() => {
    sendMailMock = jest
      .fn()
      .mockResolvedValue({ response: 'Email sent successfully' });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    require('../utils/notifications/addCollectionHandler');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call sendMail with correct email options', async () => {
    const emailOptions = {
      from: 'kevinrwema@gmail.com',
      to: 'developer.purpose@gmail.com',
      subject: 'Hello from Node.js',
      text: 'Hello, this is a test email from Node.js!',
      html: '<b>Hello, this is a test email from Node.js!</b>',
    };
    await addCollectionEmitter.emit('add', emailOptions);
    const transporter = nodemailer.createTransport();
    expect(sendMailMock).toHaveBeenCalled();
  });
});
