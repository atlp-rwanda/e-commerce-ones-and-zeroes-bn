import sendMail from "../helps/nodemailer";
import { sendChangePasswordNoficationMail } from "../helps/MailTemplate";
function changePasswordUpdateNotification(user: any): void {
    console.log(`Password update notification sent to ${user.email}`);
    const email: string = user.email;
    const userName: string = user.firstName
    const subject: string = "Password Update Notification";
    const htmlContent: string = sendChangePasswordNoficationMail;
    sendMail(email,userName, subject, htmlContent)
}

export default changePasswordUpdateNotification;