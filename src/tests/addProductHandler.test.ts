import { db } from '../database/models';
import { addProductEmitter } from '../utils/notifications/eventEmittersModule';
const nodemailer = require('nodemailer');

jest.mock('nodemailer');

describe('addProduct', () => {
  let sendMailMock: any;

  beforeAll(() => {
    sendMailMock = jest
      .fn()
      .mockResolvedValue({ response: 'Email sent successfully' });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });
    require('../utils/notifications/addProductHandler');
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

    const product: any = {
      dataValues: {
        productId: '218cac23-38ce-4fc1-99ad-cfacfa1840fc',
        name: 'Test product',
        price: '100.00',
        category: 'test',
        quantity: 10,
        expiryDate: '2024-07-20T00:00:00.000Z',
      },
    };

    const userInfo = {
      userId: '0063ea88-0e49-4b83-bcc9-6885e7dee96b',
      email: 'kevinrwema@gmail.com',
      firstName: 'Kevin',
      lastName: 'Rwema',
      passwordLastChanged: '2024-07-01T22:36:28.435Z',
      role: 'seller',
      isVerified: true,
      iat: 1720277114,
      exp: 1720363514,
    };

    const productStatus = 'dummy';
    await addProductEmitter.emit('add', { product, userInfo, productStatus });
    const transporter = nodemailer.createTransport();
    expect(sendMailMock).toHaveBeenCalled();
  });
});
