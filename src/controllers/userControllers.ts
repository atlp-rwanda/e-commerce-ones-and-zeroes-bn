import { db } from '../database/models';
import { registerToken } from '../Auth/jwt.tokens';
import passport from '../Auth/google.auth';

export default class UserController {
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
      console.log(err);
      return res.status(500).json({ message: 'Internal Serveral error!' });
    }
  }

  static async loginUserPage(req: any, res: any) {
    return res.send('User login <a href="/auth/google">google</a>');
  }

  static async googleAuth(req: any, res: any) {
    passport.authenticate('google', { scope: ['profile', 'email'] });
  }

  static async googleAuthCallback(req: any, res: any) {
    passport.authenticate('google', { failureRedirect: '/auth' }),
      function (req: any, res: any) {
        res.redirect('/auth/google/register');
      };
  }
}
