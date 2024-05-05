import { Request, Response, NextFunction } from 'express';
import { decodeToken } from '../helps/token';

// Define a custom interface that extends Request
interface AuthenticatedRequest extends Request {
  user?: any; // Define the user property here or use a specific type for it
}

const isActive = (
  res: Response,
  next: NextFunction,
  isVerified: boolean,
): void => {
  if (!isVerified) {
    res.status(406).json({ message: 'Account is not verified' });
  } else {
    next();
  }
};

const isAuthenticated = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  function sendResponse(message: any): void {
    res.status(401).json({ message });
  }
  try {
    const header = req.headers.authorization;
    if (!header) {
      sendResponse('Not Authenicated, Please Login headers');
      return;
    }
    const token = header.split(' ')[1];
    const userInfo = decodeToken(token);
    if (!userInfo) {
      sendResponse('Not Authenicated, Please Login no details');
      return;
    }
    req.user = userInfo;
    isActive(res, next, req.user.isVerified);
  } catch (error) {
    res.status(506).json({ message: 'Authenication Issues' });
  }
};

export default isAuthenticated;
