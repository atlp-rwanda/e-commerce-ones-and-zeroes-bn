import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
const jwt = require('jsonwebtoken');
import { db } from "../database/models";
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)





// if (!process.env.SENDGRID_API_KEY) {
// throw new Error('SENDGRID_API_KEY environment variable is not defined');
// }




const JWT_SECRET = process.env.JWT_SECRET; 

function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetLink = `http://localhost:7000/reset-password?token=${token}`;
  const msg = {
    to: email,
    from: "ihimbazweigor@gmail.com",
    subject: "Password Reset Request",
    html: `<p>To reset your password, click <a href="${resetLink}">here</a>.</p>`,
  };
  await sgMail.send(msg);
}

export async function handlePasswordResetRequest(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const user = await db.User.findOne({ where: { email: email } });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const tokenPayload = {
      email: user.email,
    };

    const token = generateToken(tokenPayload);

    // Store the token in the user's record
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

    await user.save();

    await sendPasswordResetEmail(email, token);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error occurred while handling password reset request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
export async function resetPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { token, newPassword } = req.body;

    if (!newPassword) {
      res.status(400).json({ error: "New password is required" });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Verify the token and decode the payload
    const decodedToken = jwt.verify(token, JWT_SECRET) as { email: string };

    // Find user by decoded email from token
    const user = await db.User.findOne({
      where: {
        
        email: decodedToken.email,
      },
    });

    if (!user) {
      res.status(400).json({ error: "Invalid token or user not found" });
      return;
    }
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error occurred while resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}