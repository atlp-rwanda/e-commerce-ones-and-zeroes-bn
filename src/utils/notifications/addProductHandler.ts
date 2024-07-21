import 'dotenv/config';
import { addProductEmailtemplate } from './nodemailerConfig';
const nodemailer = require('nodemailer');
const { addProductEmitter } = require('./eventEmittersModule');

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

addProductEmitter.on('add', async (data: any) => {
  const userId = data.userInfo.userId;
  const firstName = data.userInfo.firstName;
  const email = data.userInfo.email;
  const productName = data.product.name;
  const price = data.product.price;
  const category = data.product.category;
  const quantity = data.product.quantity;
  const expiryDate = data.product.expiryDate;

  const emailData = {
    userId,
    firstName,
    email,
    productName,
    price,
    category,
    quantity,
    expiryDate,
  };

  const mailOptions = {
    from: `E-COMMERCE-ONES-AND-ZEROES <${process.env.NODEMAILER_EMAIL_USERNAME}>`,
    to: emailData.email,
    subject: 'New Product Added',
    html: addProductEmailtemplate(emailData),
  };
  let info = await transporter.sendMail(mailOptions);
});

export { addProductEmitter };
