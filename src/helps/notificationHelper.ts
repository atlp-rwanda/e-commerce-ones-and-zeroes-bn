import { db } from '../database/models';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.NODE_MAILER_USER;
const password = process.env.NODEMAILER_EMAIL_PASSWORD;

export async function createNotification(
  userId: string,
  subject: string,
  body: string,
) {
  try {
    await db.Notifications.create({
      notificationId: uuidv4(),
      userId,
      subject,
      body,
      isRead: false,
    });

    // Get the user's email
    const user = await db.User.findByPk(userId);
    if (user) {
      // Send an email notification
      await sendEmailNotification(user.email, subject, body);
    }
  } catch (error: any) {
    console.log(error);
  }
}

export async function sendEmailNotification(
  to: string,
  subject: string,
  body: string,
) {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: email,
      pass: password,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"E-COMMERCE-ONES-AND-ZEROES" <${email}>`, // sender address
    to: to,
    subject: subject,
    text: body,
  });

  console.log('Message sent: %s', info.messageId);
}
