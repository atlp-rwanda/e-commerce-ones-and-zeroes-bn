import { Request, Response, NextFunction } from 'express';

interface User {
  role: string;
}

interface CustomRequest extends Request {
  user?: User;
}

const checkPermission =
  (role: string) => (req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.user?.role === role) {
      return next();
    }
    return res
      .status(401)
      .json({ message: `Not authorised, You are not ${role} ` });
  };

export default checkPermission;
