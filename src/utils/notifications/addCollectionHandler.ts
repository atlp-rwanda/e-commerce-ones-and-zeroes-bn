import 'dotenv/config';
import { collectionEmailTemplate } from './nodemailerConfig';

const nodemailer = require('nodemailer');
const { addCollectionEmitter } = require('./eventEmittersModule');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL_USERNAME,
    pass: process.env.NODEMAILER_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

addCollectionEmitter.on('add', async (data: any) => {
  const emailData = {
    firstName: data.firstName,
    collectionName: data.collectionName,
    created: data.created,
  };
  const emailOptions = {
    from: `E-COMMERCE-ONES-AND-ZEROES <${process.env.NODEMAILER_EMAIL_USERNAME}>`,
    to: data.email,
    subject: 'New Collection Created',
    html: collectionEmailTemplate(emailData),
  };
  let info = await transporter.sendMail(emailOptions);
});

export { addCollectionEmitter };
