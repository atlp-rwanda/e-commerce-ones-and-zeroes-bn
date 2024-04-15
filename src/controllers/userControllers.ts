import dotenv from 'dotenv';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../database/models';
import { validateEmail, validatePassword } from '../validations/validations';
import {
  registerMessageTemplate,
  nodeMail,
  successfullyverifiedTemplate,
} from '../utils/emails';
dotenv.config();
const secret = process.env.USER_SECRET;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
import { generateToken } from '../helps/generateToken';

export default class UserController {
  static async registerUser(req: Request, res: Response): Promise<Response> {
    try {
      const { firstName, lastName, email, password } = req.body as User;

      if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email' });
      }

      if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password should be strong' });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const newUser = await db.User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      const token = generateToken(newUser.userId, email, firstName, lastName);

      await nodeMail(
        email,
        firstName,
        'Welcome to One and Zero E-commerce',
        registerMessageTemplate,
        token,
      );

      return res
        .status(200)
        .json({ message: 'Account created!', data: newUser });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to register user' });
    }
  }

  static async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await db.User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch users' });
    }
  }

  static async isVerified(req: Request, res: Response) {
    try {
      const token = req.params.token;
      if (!token) {
        return res.status(400).json({ error: 'No token provided' });
      }

      let decoded: any;
      decoded = jwt.verify(token, secret!);
      console.log('Decoded token:', decoded);
      const { userId } = decoded;
      console.log(userId);

      const [updated] = await db.User.update(
        { isVerified: true },
        { where: { userId } },
      );

      if (updated === 0) {
        throw new Error('No user updated');
      }

      const email = decoded.email;
      const name = decoded.name;

      await nodeMail(
        email,
        name,
        'Welcome to One and Zero E-commerce',
        successfullyverifiedTemplate,
        token,
      );

      res.status(200).json({ message: 'Email successfully verified' });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(400).json({ error: 'Invalid token content' });
      } else {
        return res
          .status(500)
          .json({ error: 'An error occurred during email verification' });
      }
    }
  }

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
      if (!user.isVerified) {
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
