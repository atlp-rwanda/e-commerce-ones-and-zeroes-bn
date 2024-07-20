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
      const lastPasswordChangeDate = new Date(decoded.passwordLastChanged);

      const minutes = process.env.PASSWORD_EXPIRATION_PERIOD_MINUTES;
      const expirationPeriod = minutes ? parseInt(minutes, 10) : undefined;

      if (expirationPeriod === undefined) {
        console.error('PASSWORD_EXPIRATION_PERIOD_MINUTES is not defined');
        return res.status(500).send('Server configuration error');
      }

      const currentTime = new Date();
      const timeInMillis = expirationPeriod * 60 * 1000; // Correct conversion from minutes to milliseconds

      if (
        currentTime.getTime() - lastPasswordChangeDate.getTime() >
          timeInMillis &&
        req.path !== `/login`
      ) {
        res.redirect(`${process.env.CLIENT_URL}/reset/new-password?q=${token}`);
      }
    }
  }

  next();
}
