import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const {
  NODEMAILER_EMAIL_USERNAME,
  NODEMAILER_EMAIL_PASSWORD,
  PORT,
  CLIENT_URL,
} = process.env;

// CONFIGURE HOST
const host: string =
  process.env.NODE_ENV === 'production'
    ? process.env.API_URL!
    : `http://localhost:${PORT}`;

const registerMessageTemplate = (firstName: string, token: string): any => `

<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #fff; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #FF6D18; border-radius: 10px; background-color: #ffffff;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Dear ${firstName},</div>
        <p style="font-size: 16px; font-weight: bold;">You have successfully registered on E-COMMERCE-ONES-AND-ZEROES. We are happy to have you on board.</p>
        <p style="font-size: 16px;">Please click on the following button to verify your account:</p>
        
        <div style="text-align: center;">
            <a href="${host}/api/users/isVerified/${token}" style="text-decoration: none;">
                <button id="verifyButton" style="background-color: #0F1848; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"
                    onmouseover="this.style.backgroundColor='#FF6D18';"
                    onmouseout="this.style.backgroundColor='#0F1848';">Verify your email</button>
            </a>
        </div>
    </div>
</div>


`;

const successfullyverifiedTemplate = (firstName: string): string => `
<div style="margin-top: 20px; font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #fff; border: 1px solid #FF6D18; border-radius: 10px; padding: 20px;">
    <p style="font-size: 16px; margin-bottom: 20px;">Dear ${firstName},</p>
    <p style="font-size: 16px; margin-bottom: 20px;">You have successfully verified on <strong>E-COMMERCE-ONES-AND-ZEROES</strong>. We are happy to have you on board.</p>
    <p style="font-size: 16px; margin-bottom: 20px;">Below is the link to our platform. Please log in with your email and password:</p>
    <div style="text-align: center; font-size: 16px; margin-bottom: 20px;">
        <a href="${CLIENT_URL}/login" id="loginButton" style="display: inline-block; text-align: center; padding: 10px 20px; color: #FFF; background-color: #0F1848; text-decoration: none; border-radius: 5px; font-size: 16px;"
            onmouseover="this.style.backgroundColor='#FF6D18';"
            onmouseout="this.style.backgroundColor='#0F1848';">Log In Now</a>
    </div>
</div>


`;

const successfullyDisabledAccountTemplate = (
  firstName: string,
  reason: string,
): string => `
Dear ${firstName},
your account has been disabled for the following reasons.
        
Reason: ${reason}
        
Please contact us to appeal this action, Thanks.
`;

const successfullyRestoredAccountTemplate = (firstName: string): string => `
Dear ${firstName},
your account has been restored.
`;

const resetPasswordEmail = (token: string, username: string): string => `


<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #fff; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #ffffff;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">Dear ${username},</div>
          <p style="font-size: 16px;">Please click on the following button to Reset your password</p>
          <p>If you haven't requested it, please ignore this email</p>
        <div style="text-align: center;">
            <a  href="${process.env.CLIENT_URL}/reset/new-password?q=${token}" style="text-decoration: none;">
                <button style="background-color: #0F1848; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; cursor: pointer;"> Reset Password</button>
            </a>
        </div>
    </div>
</div>

`;
/* TWO FACTOR AUTHENTICATION MESSAGE TEMPLATE */

const twoFAMessageTemplate = (username: string, token: string) => `
<body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #ddd; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">
            Two-Factor Authentication Request
        </div>
        <div style="font-size: 16px; line-height: 1.6;">
            Dear ${username},
            <br><br>
            You have requested to enable two-factor authentication on your account. Please use the token below to confirm your identity:
            <div style="display: block; margin: 20px 0; font-size: 20px; font-weight: bold; color: #FF6D18; text-align: center; background-color: #f0f0f0; padding: 10px; border-radius: 5px;">
                ${token}
            </div>
            Copy and paste the token above into the input field on the page.
            <br><br>
            If you did not request two-factor authentication, please contact our support team immediately.
            <br><br>
            Thank you.
        </div>
        <div style="font-size: 14px; color: #888; margin-top: 20px;">
            Best regards,<br>
            One's and Zero's Support Team
        </div>
    </div>
</body>`;

/*  AvailableProduct  */
const sendProductEndEmail = (firstName: string) => `
Dear ${firstName},

There is a product that was said to have ended on the market.
Please check it to make it available again on the market.
`;

const nodeMail = async (
  email: string,
  subject: string,
  message: string,
): Promise<any> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: NODEMAILER_EMAIL_USERNAME,
        pass: NODEMAILER_EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    const mailOptions = {
      from: `E-COMMERCE-ONES-AND-ZEROES <${NODEMAILER_EMAIL_USERNAME}>`,
      to: email,
      subject: subject,
      html: `
      <html>
      <head>
      </head>
      <body style="background-color: #f4f4f4; padding: 20px;">
      ${message}
      </body>
      </html>      
      `,
    };
    // SEND EMAIL
    return await transporter.sendMail(mailOptions);
    // RETURN SUCCESS MESSAGE
  } catch (error) {
    return error;
  }
};

export {
  registerMessageTemplate,
  nodeMail,
  successfullyverifiedTemplate,
  successfullyDisabledAccountTemplate,
  successfullyRestoredAccountTemplate,
  resetPasswordEmail,
  twoFAMessageTemplate,
  sendProductEndEmail,
};
