import { Request, Response } from 'express';
import bcryptjs from 'bcrypt';
import User from '../models/userModels';
import { validateEmail, validatePassword } from '../validations/validations';

export const registerUser = async (req: Request, res: Response): Promise<Response> => {
  try {
      const { fullName,
         email, 
         PhoneNumber,
         Adress,
         Gender,
         password } = req.body;
      const existingUser:any = await User.findOne({ where: {email} });
      if (existingUser) {
          return res.json({ "Message": `User with this email ${email} already exists` });
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);

      const validEmail = validateEmail(email);
      const validPassword = validatePassword(password);
      if (validEmail && validPassword){
        const user = await User.create({
          fullName,
          email,
          PhoneNumber,
          Adress,
          Gender,
          password: hashedPassword
        });

        if(!validEmail && !validPassword){
          return res.status(400).json({ message: "Invalid email or password" })
          
        }
        
      }
      return res.status(201).json({ message: "Account created succesfully",  })
      


  } catch (error) {
      console.log(error);
      
      return res.sendStatus(400);
  }
}

export const getUsers = async(req: Request, res: Response)=>{
    try{
        const users = await User.findAll();
        return res.status(200).json(users);

       }catch(error){
       console.log(error);
       throw error;
        
    }
    
}
