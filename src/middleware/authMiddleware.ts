import { Request, Response, NextFunction } from 'express';
import { db } from '../database/models';
const jwt = require('jsonwebtoken');

export default class authMiddleware {
  static isAuthenticated = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const authorization: string | undefined = req.headers['authorization'];
      if (!authorization) {
        return res
          .status(401)
          .json({ message: 'Missing authorization header' });
      }
      const token: string = authorization.split(' ')[1];
      if (!token) {
        return res
          .status(401)
          .json({ message: 'Invalid authorization header' });
      }
      const payload: any = await jwt.verify(token, process.env.JWT_SECRET);
      const existingUser = await db.User.findOne({
        where: {
          userId: payload.userId,
        },
      });
      if (!existingUser) {
        return res.status(404).json({ message: 'No such user found' });
      }
      (req as any).user = existingUser;
      next();
    } catch (error: any) {
      console.log(error);
      res.status(500).json({ message: 'Failed to verify user authentication' });
    }
  };

  static checkRole = (req: Request, res: Response, next: NextFunction) => {
    let user = (req as any).user;
    if (user.role !== 'admin') {
      return res.status(401).json({ message: 'User is not authorized' });
    }
    next();
  };
}
