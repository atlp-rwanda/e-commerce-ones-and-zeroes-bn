import passport from "passport";
import dotenv from 'dotenv'
import { error } from "console";
dotenv.config()
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(request: any, accessToken:any, refreshToken:any, profile:any, done:any){
    return done(null, profile)
  }
 
));

passport.serializeUser(function(user, done){
    done(null, user)
})
passport.deserializeUser(function(user:any, done){
    done(null, user)
})

export default passport
