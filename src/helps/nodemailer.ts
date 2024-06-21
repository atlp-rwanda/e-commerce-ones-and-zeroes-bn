import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const NODE_MAILER_USER: string = process.env.NODE_MAILER_USER || '';
const GMAIL_PASSWORD: string = process.env.GMAIL_PASSWORD || '';

async function sendEmail(
  email: string,
  firstName: string,
  subject: string,
  html: string,
): Promise<void> {
  const config = {
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL_USERNAME || '',
      pass: process.env.NODEMAILER_EMAIL_PASSWORD || '',
    },
    tls: {
      rejectUnauthorized: false,
    },
  };

  const transporter = nodemailer.createTransport(config);

  const message = {
    from: NODE_MAILER_USER,
    to: email,
    subject: subject,
    html: `
        <html>
        <head>
        </head>
        <body style="background-color: #f4f4f4; padding: 20px;">
        <h1 style="color: #333333; text-align: center;">OnesAndZeroes</h1>
        <p style="color: #666666; text-align: left;">Dear ${firstName},</p>
            ${html}
        </body>
        </html>      
        `,
  };

  try {
    await transporter.sendMail(message);
  } catch (error) {
    // console.error('Error sending email:', error);
  }
}

export default sendEmail;
