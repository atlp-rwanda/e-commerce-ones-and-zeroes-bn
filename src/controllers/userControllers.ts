import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validateEmail, validatePassword } from '../validations/validations';
import { db } from '../database/models';
import { generateToken } from '../helps/generateToken';

export default class UserController {
  static async registerUser(req: Request, res: Response) {
    console.log(req.body);
    try {
      const { firstName, lastName, email, password } = req.body;
      console.log(req.body);

      // Check if user with the given email already exists
      const existingUser = await db.User.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      // Validate email and password
      const validEmail = validateEmail(email);
      const validPassword = validatePassword(password);

      if (!validEmail) {
        return res.status(400).json({ message: 'Invalid email' });
      }

      if (!validPassword) {
        return res.status(400).json({ message: 'password should be strong' });
      }

      // Hash the password
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Create new user
      const newUser = await db.User.create({
        firstName,
        lastName,
        email: email,
        password: hashedPassword,
      });

      // Create the user in the database
      // Return success response
      // const { password: userPassword,...userDetails } = newUser.dataValues;
      return res
        .status(200)
        .json({ message: 'Account created!', data: newUser });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to register user' });
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
