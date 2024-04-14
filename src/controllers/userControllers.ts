import { Request, Response } from "express";
import sgMail from "@sendgrid/mail";
import crypto from "crypto";
import { User } from "../models/userModels";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateToken(): string {
  return crypto.randomBytes(20).toString("hex");
}

export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetLink = `http://localhost:7000/reset-password?token=${token}`;
  const msg = {
    to: email,
    from: "onesandzeros@ecommerce.com",
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

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const token = generateToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000);

    await user.save();

    await sendPasswordResetEmail(email, token);

    res.status(200).json({ message: "Password reset email sent successfully" });
  } catch (error) {
    console.error(
      "Error occurred while handling password reset request:",
      error
    );
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function resetPassword(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400).json({ error: "Invalid or expired token" });
      return;
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error occurred while resetting password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
