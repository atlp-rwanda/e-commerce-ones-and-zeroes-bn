import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const { JWT_SECRET } = process.env;

export function verifyToken(authorizationHeader: string): any {
  try {
    if (!authorizationHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authorizationHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET as string);
    return decoded;
  } catch (err) {
    return null;
  }
}
