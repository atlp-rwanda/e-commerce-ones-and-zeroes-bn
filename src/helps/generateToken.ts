import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
  passwordLastChanged: string,
  role: string,
  isVerified: boolean,
): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not defined');
  }
  return jwt.sign(
    {
      userId,
      email,
      firstName,
      lastName,
      passwordLastChanged,
      role,
      isVerified,
    },

    secret,

    {
      expiresIn: '1d',
    },
  );
};
