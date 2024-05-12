import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export class JWT {
  static signJwt(data: any, exp = '1d'): string {
    const secretKey: Secret = process.env.JWT_SECRET as Secret;
    return jwt.sign(data, secretKey, { expiresIn: exp });
  }
}
