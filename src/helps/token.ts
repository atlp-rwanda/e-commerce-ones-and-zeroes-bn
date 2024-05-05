import { constants } from 'buffer';
import jwt from 'jsonwebtoken';

export function decodeToken(token: string): any {
  const verify = jwt.verify(token, process.env.JWT_SECRET as string);
  return verify;
}
