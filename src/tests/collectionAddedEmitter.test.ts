import 'dotenv/config';
const nodemailer = require('nodemailer');

describe('NODEMAILER_EMAIL_USERNAME', () => {
  it('should use the righ ENV Variable', () => {
    const NODEMAILER_EMAIL_USERNAME = process.env.NODEMAILER_EMAIL_USERNAME;
    const expectedEnv = process.env.NODEMAILER_EMAIL_USERNAME;

    expect(NODEMAILER_EMAIL_USERNAME).toBe(expectedEnv);
  });
});
