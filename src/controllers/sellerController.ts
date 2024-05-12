import { Request, Response } from 'express';
import speakeasy from 'speakeasy';
import { db } from '../database/models';
import { generateToken } from '../helps/generateToken';

interface CustomRequest extends Request {
  user?: any;
}

export default class SellerController {
  static async toggle2FA(req: CustomRequest, res: Response) {
    try {
      const user = req.user;

      // Fetch user details from the database using user.id
      const fetchedUser = await db.User.findByPk(user.userId);
      if (!fetchedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Toggle 2FA setting
      const updatedUse2FA = !fetchedUser.use2FA;
      await fetchedUser.update({ use2FA: updatedUse2FA });

      // Respond with success message
      res.status(200).json({
        message: `2FA has been ${updatedUse2FA ? 'enabled' : 'disabled'} for the user`,
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating 2FA setting' });
    }
  }

  static async twoFAController(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { token } = req.body;

      const user = await db.User.findByPk(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const verified = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token,
        step: 120,
      });

      if (verified) {
        const jwtToken = generateToken(
          user.userId,
          user.email,
          user.firstName,
          user.lastName,
          user.role,
          user.passwordLastChanged,
          user.isVerified,
        );

        res.json({ verified: true, token: jwtToken });
      } else {
        res.status(401).json({
          verified: false,
          message: 'You provided an incorrect token',
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: 'Error during 2FA verification' });
    }
  }
}
