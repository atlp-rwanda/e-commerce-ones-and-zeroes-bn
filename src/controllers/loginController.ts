// import { Request, Response } from 'express';
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import speakeasy from 'speakeasy';
// import { db } from '../database/models';
// import { nodeMail, twoFAMessageTemplate } from '../utils/emails';
// import qr from 'qr-image';
// import { OTPAlgorithm } from '../helps/Algorithm';

// const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

// export default class UserController {
//   static async login(req: Request, res: Response) {
//     try {
//       const { email, password, use2FA } = req.body;
//       if (!email || !password) {
//         return res.status(400).json({ message: 'Email and password are required' });
//       }

//       const user = await db.User.findOne({ where: { email } });
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       const isPasswordMatch = await bcrypt.compare(password, user.password);
//       if (!isPasswordMatch) {
//         return res.status(401).json({ message: 'Incorrect credentials' });
//       }

//       if (user.role === 'seller' && use2FA) {
//         // Generate a new secret for 2FA
//         const secret = speakeasy.generateSecret({ length: 20 }).base32;
//         // Update the user's secret in the database
//         await user.update({ secret });

//         // Generate the otpauth URL
//         const otpauthUrl = speakeasy.otpauthURL({
//           secret,
//           label: user.email,
//           issuer: 'One and Zero E-commerce',
//           algorithm: OTPAlgorithm.SHA1,
//           digits: 6,
//           period: 30,
//           encoding: 'base32',
//         });

//         // Generate a QR code for the otpauth URL
//         const qrCode = qr.imageSync(otpauthUrl, { type: 'svg' });

//         // Check if the qrCode variable is defined and is a string
//         if (typeof qrCode === 'string') {
//           // Send the email with the QR code
//           const name = user.name;
//           const token = secret;
//           await nodeMail(
//             email,
//             name,
//             'Welcome to One and Zero E-commerce',
//             twoFAMessageTemplate,
//             token,
//             qrCode,
//           );

//           // Send response with message to check email for 2FA setup
//           res.status(200).json({ message: 'Check your email for the 2FA setup instructions', id: user.id });
//         } else {
//           // Handle the error if the qrCode variable is not defined or is not a string
//           res.status(500).json({ message: 'Error generating the QR code' });
//         }
//       } else {
//         // Generate JWT token without 2FA
//         const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//         res.status(200).json({ message: 'User authenticated', token });
//       }
//     } catch (error: any) {
//       res.status(500).json({ message: 'Error during login' });
//     }
//   }

//   static async twoFAController(req: Request, res: Response) {
//     try {
//       const { userId, token } = req.body;
//       console.log(`Received request for 2FA verification with userId: ${userId} and token: ${token}`);

//       // Get the user from the database
//       const user = await db.User.findByPk(userId);
//       console.log(`User found: ${user !== null}`);

//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }

//       // Use verify to check the token against the secret
//       const secret = user.secret;
//       console.log(`Secret: ${secret}`);
//       const verified = speakeasy.totp.verify({
//         secret,
//         encoding: 'base32',
//         token,
//       });

//       if (verified) {
//         // Generate JWT token upon successful 2FA verification
//         const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
//         res.json({ verified: true, token: jwtToken });
//       } else {
//         res.status(401).json({ verified: false, message: 'You provided an incorrect token' });
//       }
//     } catch (error: any) {
//       res.status(500).json({ message: 'Error during 2FA verification' });
//     }
//   }
// }

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { db } from '../database/models';
import { nodeMail, twoFAMessageTemplate } from '../utils/emails';

const JWT_SECRET = 'your_jwt_secret'; // Replace with your actual secret

export default class UserController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await db.User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Incorrect credentials' });
      }

      if (user.role === 'seller') {
        if (!user.use2FA) {
          // Update use2FA to true and generate a new secret
          const secret = speakeasy.generateSecret({ length: 20 }).base32;
          await user.update({ use2FA: true, secret });

          // Generate a token for 2FA
          const token = speakeasy.totp({
            secret,
            encoding: 'base32'
          });

          // Send the email with the token
          const name = user.name;
          await nodeMail(
            email,
            name,
            '2FA Token for One and Zero E-commerce',
            twoFAMessageTemplate,
            token
          );

          // Send response with message to check email for 2FA token
          return res.status(200).json({ message: 'Check your email for the 2FA token', id: user.id });
        }

        // If use2FA is already true, proceed with sending the 2FA token
        const token = speakeasy.totp({
          secret: user.secret,
          encoding: 'base32'
        });

        // Send the email with the token
        const name = user.name;
        await nodeMail(
          email,
          name,
          '2FA Token for One and Zero E-commerce',
          twoFAMessageTemplate,
          token
        );

        // Send response with message to check email for 2FA token
        return res.status(200).json({ message: 'Check your email for the 2FA token', id: user.id });
      } else {
        // Generate JWT token without 2FA
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'User authenticated', token });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error during login' });
    }
  }
  static async toggle2FA(req: Request, res: Response) {
    try {
      const { userId, enable } = req.body;

      // Get the user from the database
      const user = await db.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (enable) {
        // Generate a new secret for 2FA if enabling
        const secret = speakeasy.generateSecret({ length: 20 }).base32;
        await user.update({ use2FA: true, secret });
      } else {
        // Disable 2FA
        await user.update({ use2FA: true, secret: null });
      }

      res.status(200).json({ message: `2FA has been enabled  for the seller` });
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating 2FA setting' });
    }
  }

  static async twoFAController(req: Request, res: Response) {
    try {
      const { userId, token } = req.body;

      // Get the user from the database
      const user = await db.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify the token against the secret
      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token
      });

      if (verified) {
        // Generate JWT token upon successful 2FA verification
        const jwtToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ verified: true, token: jwtToken });
      } else {
        res.status(401).json({ verified: false, message: 'You provided an incorrect token' });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error during 2FA verification' });
    }
  }
}

