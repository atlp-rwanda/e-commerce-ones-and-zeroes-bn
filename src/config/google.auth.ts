import dotenv from 'dotenv';
dotenv.config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.URL_RESPONSE_CALLBACK,
      passReqToCallback: true,
    },

    function (
      req: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void,
    ) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser(function (user: any, done: any) {
  done(null, user);
});

passport.deserializeUser(function (obj: any, done: any) {
  done(null, obj);
});

export default passport;
