// passport.authenticate('google', { scope: ['profile', 'email'] })

import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config();
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:8000/auth/google/callback',
      passReqToCallback: true,
    },

    function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: (arg0: null, arg1: any) => any,
    ) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  /*@ts-ignore*/
  return done(null, obj);
});

export default passport;
