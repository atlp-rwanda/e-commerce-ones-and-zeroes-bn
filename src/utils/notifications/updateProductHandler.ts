import 'dotenv/config';
import { productAvailabilityEmailTemplate } from './nodemailerConfig';
const nodemailer = require('nodemailer');
const { updateProductEmitter } = require('./eventEmittersModule');

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

updateProductEmitter.on('update', async (data: any) => {
  const emailData = {
    firstName: data.userInfo.firstName,
    name: data.product.dataValues.name,
    newStatus: data.productStatus,
    price: data.product.dataValues.price,
    quantity: data.product.dataValues.quantity,
    expiryDate: data.product.dataValues.expiryDate,
  };
  const emailOptions = {
    from: `E-COMMERCE-ONES-AND-ZEROES <${process.env.NODEMAILER_EMAIL_USERNAME}>`,
    to: data.userInfo.email,
    subject: 'Product status changed',
    html: productAvailabilityEmailTemplate(emailData),
  };
  let info = await transporter.sendMail(emailOptions);
});

export { updateProductEmitter };
