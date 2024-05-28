import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helps/verifyToken';

const JWT_SECRET = process.env.JWT_SECRET;

export function changePasswordIgnored(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers.authorization;

  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      const lastPasswordChangeDate = new Date(
        decoded.passwordLastChanged * 1000,
      );
      const currentTime = new Date();
      const oneDayInMillis = 24 * 60 * 60 * 1000;

      if (
        currentTime.getTime() - lastPasswordChangeDate.getTime() >
          oneDayInMillis &&
        req.path !== '/login'
      ) {
        return res.redirect('https://onesandzeroes/users/update');
      }
    }
  }

  next();
}
