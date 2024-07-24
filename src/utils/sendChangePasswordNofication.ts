import sendMail from '../helps/nodemailer';
import { sendChangePasswordNotificationMail } from '../helps/MailTemplate';
function changePasswordUpdateNotification(user: any, token: string): void {
  const email: string = user.email;
  const userName: string = user.firstName;
  const userToken: string = token;
  const subject: string = 'You are required to update your password';
  const htmlContent: string = sendChangePasswordNotificationMail(
    userToken,
    userName,
  );
  sendMail(email, userName, subject, htmlContent);
}

export default changePasswordUpdateNotification;
