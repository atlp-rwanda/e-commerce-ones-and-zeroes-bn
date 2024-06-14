import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../helps/generateToken';
import { validateEmail, validatePassword } from '../validations/validations';
import {
  registerMessageTemplate,
  nodeMail,
  successfullyverifiedTemplate,
  successfullyDisabledAccountTemplate,
  successfullyRestoredAccountTemplate,
  resetPasswordEmail,
} from '../utils/emails';
import { db } from '../database/models';
import passport from '../config/google.auth';
import { registerToken } from '../config/jwt.token';
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();
const secret = process.env.JWT_SECRET;

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  isVerified: boolean;
  isSeller?: boolean;
}

export default class UserController {
  static async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const users = await db.User.findAll();
      return res.status(200).json({
        status: 'success',

        data: users,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch users' });
    }
  }

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

      const isSeller: boolean = req.body.isSeller;

      const newUser = await db.User.create({
        firstName,
        lastName,
        email,
        role: isSeller ? 'seller' : 'buyer',
        password: hashedPassword,
      });
      console.log(newUser);

      const token = generateToken(
        newUser.userId,

        email,

        firstName,

        lastName,
        newUser.passwordLastChanged,

        newUser?.role,
        newUser?.isVerified,
      );

      await nodeMail(
        email,
        'You are required to Verify your email',
        registerMessageTemplate(firstName, token),
      );

      return res
        .status(200)
        .json({ message: 'Account created!', data: newUser, token });
    } catch (error: any) {
      return res.status(500).json({ message: 'Failed to register user' });
    }
  }

  // get single profile/user controller
  static async getSingleUser(req: Request, res: Response) {
    try {
      const singleUser = await db.User.findOne({
        where: {
          userId: req.params.id,
        },
      });
      if (singleUser) {
        return res.status(200).json({
          status: 'User Profile',
          data: singleUser,
          billing: singleUser.billingAddress,
        });
      }
    } catch (error: any) {
      return res.status(500).json({
        message: "provided ID doen't exist!",
        error: error.message,
      });
    }
  }
  //update single profile/user
  static async updateSingleUser(req: Request, res: Response) {
    try {
      const singleUser = await db.User.findOne({
        where: {
          userId: req.params.id,
        },
      });

      if (!singleUser) {
        return res.status(404).json({
          status: 'Not Found',
          error: 'User not found',
        });
      }

      const {
        firstName,
        lastName,
        gender,
        birthdate,
        preferredLanguage,
        preferredCurrency,
        billingAddress,
      } = req.body;

      if (firstName) {
        singleUser.firstName = firstName;
      }
      if (lastName) {
        singleUser.lastName = lastName;
      }
      if (gender) {
        singleUser.gender = gender;
      }
      if (birthdate) {
        singleUser.birthdate = birthdate;
      }
      if (preferredLanguage) {
        singleUser.preferredLanguage = preferredLanguage;
      }
      if (preferredCurrency) {
        singleUser.preferredCurrency = preferredCurrency;
      }
      if (billingAddress) {
        singleUser.billingAddress = billingAddress;
      }

      singleUser.updatedAt = new Date();

      if (req.body.email) {
        return res.status(400).json({
          status: 'Bad Request',
          error: 'Email cannot be updated',
        });
      }

      await singleUser.save();

      return res.status(200).json({
        status: 'Profile updated successfully',
        data: singleUser,
      });
    } catch (err: any) {
      return res.status(500).json({
        status: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  static async registerUserGoogle(req: any, res: any) {
    const data = req.user._json;
    let firstName = data.given_name;
    let lastName = data.family_name;
    let email = data.email;
    const newUser = {
      firstName,
      lastName,
      email,
      isActive: true,
      isGoogle: true,
      password: 'google',
    };
    try {
      const alreadyRegistered = await db.User.findOne({
        where: { email: email, isGoogle: true },
      });
      if (alreadyRegistered) {
        const payLoad = {
          userId: alreadyRegistered.userId,
          firstName: alreadyRegistered.firstName,
          lastName: alreadyRegistered.lastName,
          role: alreadyRegistered.role,
        };
        const userToken = await registerToken(payLoad);
        return res.status(201).json({ message: 'User signed in!', userToken });
      }
      const createdUser = await db.User.create(newUser);
      return res.status(201).json({
        message: 'User registered Successful, Please Sign in!',
        userId: createdUser.userId,
      });
    } catch (err) {
      return res.status(500).json({ message: 'Internal Serveral error!' });
    }
  }

  static async loginUserPage(req: any, res: any) {
    return res.send('User login <a href="/auth/google">google</a>');
  }

  static async googleAuth(req: any, res: any) {
    passport.authenticate('google', { scope: ['profile', 'email'] });
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
        user.passwordLastChanged,
        user.role,
        user?.isVerified,
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
  static async disableUser(req: Request, res: Response) {
    try {
      const { reason } = req.body;
      const existingUser = await db.User.findOne({
        where: { userId: req.params.id },
      });
      const user = (req as any).user;
      if (!existingUser) {
        return res.status(404).json({ message: 'No such User found' });
      }
      if (existingUser.dataValues.userId === user.userId) {
        return res.status(403).json({ message: 'User cannot self-disable' });
      }

      if (!existingUser.dataValues.isActive) {
        await db.User.update(
          { isActive: true },
          {
            where: {
              userId: req.params.id,
            },
          },
        );
        const restoredMessage: string = successfullyRestoredAccountTemplate(
          existingUser.dataValues.firstName,
        );
        await nodeMail(
          existingUser.dataValues.email,
          'Your account was restored',
          restoredMessage,
        );
        return res
          .status(200)
          .json({ message: 'User account was successfully restored' });
      }
      if (!reason) {
        return res
          .status(400)
          .json({ message: 'Missing reason for disabling account' });
      }
      await db.User.update(
        { isActive: false },
        {
          where: {
            userId: req.params.id,
          },
        },
      );
      const disabledMessage: string = successfullyDisabledAccountTemplate(
        existingUser.dataValues.firstName,
        reason,
      );

      await nodeMail(
        existingUser.dataValues.email,
        'Your account was disabled',
        disabledMessage,
      );
      return res
        .status(200)
        .json({ message: 'User account was successfully disabled' });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Failed to disable user account' });
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
      const { userId } = decoded;
      const [updated] = await db.User.update(
        { isVerified: true },
        { where: { userId } },
      );

      if (updated === 0) {
        throw new Error('No user updated');
      }

      const email = decoded.email;
      const name = decoded.firstName;

      await nodeMail(
        email,
        'Welcome to One and Zero E-commerce',
        successfullyverifiedTemplate(name),
      );

      return res
        .status(200)
        .redirect(`${process.env.CLIENT_URL}/users/isVerified`);
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

  static async updatePassword(req: any, res: Response) {
    const { token } = req;
    const { password, newPassword, verifyNewPassword } = req.body;

    try {
      const getDecodedToken = jwt.verify(token, secret);
      const userId = getDecodedToken.userId;
      const userData = await db.User.findOne({
        where: { userId: userId },
      });

      if (!userData) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found',
        });
      }

      //extract Hash Password from user detail
      const currentHash = userData.dataValues.password;

      try {
        const result = await bcrypt.compare(password, currentHash);
        if (result == false) {
          return res.status(401).json({
            status: 'fail',
            message: 'Wrong credentials',
          });
        }

        //hashNewPassword
        const saltRounds = 10;
        const salt: any = await bcrypt.genSalt(saltRounds);
        const newHashPassword = await bcrypt.hash(newPassword, salt);

        const [updatePassword] = await db.User.update(
          { password: newHashPassword },
          { where: { userId: userId } },
        );

        if (updatePassword > 0) {
          return res.status(200).json({
            status: 'OK',
            message: 'Password updated successfully',
          });
        }
      } catch (e) {
        return res.status(500).json({
          status: 'error',
          message: 'Server error',
        });
      }
    } catch (e) {
      res.status(500).json({
        status: 'fail',
        message: 'something went wrong: ' + e,
      });
    }
  }

  static async setUserRoles(req: Request, res: Response) {
    try {
      const { role } = req.body;
      if (!role)
        return res.status(400).json({
          message: 'role can not be empty',
        });
      const user = await db.User.findOne({ where: { userId: req.params.id } });
      if (!user)
        return res.status(404).json({
          message: 'user not found',
        });

      const updatedUser = await db.User.update(
        { role: role },
        { where: { userId: req.params.id } },
      );
      return res.status(200).json({
        message: 'user role updated',
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

dotenv.config();

export async function handlePasswordResetRequest(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await db.User.findOne({ where: { email: email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const token = generateToken(
      user.userId,
      user.email,
      user.firstName,
      user.lastName,
      user.role,
      user.passwordLastChanged,
      user.isVerified,
    );

    // Store the token in the user's record
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiration

    await user.save();

    await nodeMail(email, 'Reset password request', resetPasswordEmail(token));

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
export async function resetPassword(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const { newPassword } = req.body;
    const token = req.params.token;

    if (!newPassword) {
      res.status(400).json({ error: 'New password is required' });
      return;
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Verify the token and decode the payload
    const decodedToken = jwt.verify(token, secret) as { email: string };

    // Find user by decoded email from token
    const user = await db.User.findOne({
      where: {
        email: decodedToken.email,
      },
    });

    if (!user) {
      res.status(400).json({ error: 'Invalid token or user not found' });
      return;
    }
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
