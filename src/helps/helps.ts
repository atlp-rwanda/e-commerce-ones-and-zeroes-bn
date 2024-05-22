import jwt from 'jsonwebtoken';

const secret = process.env.USER_SECRET;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const generateToken = (
  userId: string,
  email: string,
  firstName: string,
  lastName: string,
): string => {
  if (!secret) {
    throw new Error('JWT secret not defined'); //not test
  }
  return jwt.sign({ userId, email, firstName, lastName }, secret, {
    expiresIn: '7d',
  });
};
