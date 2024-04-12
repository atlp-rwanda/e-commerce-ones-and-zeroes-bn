import { Express } from "express";
import passport from 'passport';
import dotenv from 'dotenv';
dotenv.config()





const LoginGoogle =  (req: any, res: any) =>{
     passport.authenticate('google', { scope: ['profile', 'email'] })
}



export default LoginGoogle