import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../database/models';
import { generateToken } from '../helps/generateToken';

export default class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: 'Email and password are required' });
      }

      // Find the user by email
      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }

      // Check if the provided password matches the password in db
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).send({ message: 'Incorrect credentials' });
      }

      // Check if the user's email is verified
      if (!user.isverified) {
        return res.status(401).send({ message: 'Email not verified' });
      }

      // Generate a JWT token
      const token = generateToken(
        user.userId,
        user.email,
        user.firstName,
        user.lastName,
      );

      // Send a response indicating that the login was successful, along with the token
      return res.status(200).send({ message: 'Login successful', token });
    } catch (error: any) {
      // console.error(error);
      return res
        .status(500)
        .json({ message: 'Failed to login', error: error.message });
    }
  }
}
