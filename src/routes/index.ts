
import express, { Router, Request, Response } from 'express';
import LoginGoogle from '../controllers/userControllers';
const router: Router = express.Router();
import dotenv from 'dotenv';
import passport from '../auth/GoogleAuth';
dotenv.config()

const  isLoggedIn =(req:any, res:any, next: () => any) =>{
  req.user? next(): res.sendStatus(401)
}
router.get('/', (req: Request, res: Response) => {
  res.send('Welcome to OnesAnd Ecommerce website');
});

router.get('/auth', (req:any, res:any) =>{
  res.send('<a href="/auth/google">Login via google</a>')
  // return res.json({message: " Hello Auth for google"})
})

router.get('/auth/google', 
  passport.authenticate('google', {scope: ['email', 'profile']})      
)

router.get("/auth/google/callback", passport.authenticate(
  'google', {
    successRedirect: '/auth/protected',
    failureRedirect: '/auth/failure'
  }
))
router.get('/auth/protected', isLoggedIn, (req, res) =>{
  console.log(req.user)
  res.json({message: "Protected Router"})
})




export default router;
