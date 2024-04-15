import nodemailer from 'nodemailer';

const { NODEMAILER_EMAIL_USERNAME, NODEMAILER_EMAIL_PASSWORD, PORT } =
  process.env;

// CONFIGURE HOST
const host: string =
  process.env.NODE_ENV === 'production'
    ? process.env.HOST!
    : `http://localhost:${PORT}`;

const registerMessageTemplate = (firstName: string, token: string): string => `
Dear ${firstName},
You have successfully registered on E-COMMERCE-ONES-AND-ZEROES. We are happy to have you on board.

Below is the link to our platform. please click on the following link to verify your account:
${host}/api/users/isVerified/${token}
`;

const successfullyverifiedTemplate = (firstName: string): string => `
Dear ${firstName},
you have successfully verified on E-COMMERCE-ONES-AND-ZEROES . we are happy to have you on board.

below is the link to our platform .please login with you email and password:
${host}/api/users/login
`;

const nodeMail = async (
  email: string,
  name: string,
  heading: string,
  messageTemplate: (firstName: string, token: string) => string,
  token: string,
): Promise<any> => {
  try {
    const message = messageTemplate(name, token);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: NODEMAILER_EMAIL_USERNAME,
        pass: NODEMAILER_EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: `E-COMMERCE-ONES-AND-ZEROES <${NODEMAILER_EMAIL_USERNAME}>`,
      to: email,
      subject: heading,
      text: message,
    };
    // SEND EMAIL
    return await transporter.sendMail(mailOptions);
    // RETURN SUCCESS MESSAGE
  } catch (error) {
    return error;
  }
};

export { registerMessageTemplate, nodeMail, successfullyverifiedTemplate };
