import { Request, Response } from 'express';
import bcryptjs from 'bcrypt';
import { validateEmail, validatePassword } from '../validations/validations';
import { db } from "../database/models";
import { JWT } from '../helps/jwtsing';
import SetRoles from '../helps/setRoles';
import { where } from 'sequelize';

export default class UserController {
    static async registerUser(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, password,role ,isAdmin} = req.body;
          

            // Check if user with the given email already exists
            const existingUser = await db.User.findOne({ where: { email: email } });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Validate email and password
            const validEmail = validateEmail(email);
            const validPassword = validatePassword(password);

            if (!validEmail) {
                return res.status(400).json({ message: 'Invalid email' });
            }

            if (!validPassword) {
                return res.status(400).json({ message: 'password should be strong' });
            }

            // Hash the password
            const hashedPassword = bcryptjs.hashSync(password, 10);

            // Create new user
            const newUser = await db.User.create({
                firstName,
                lastName,
                role,
                isAdmin,
                email: email,
                password: hashedPassword
            });
            // Create the user in the database
            // Return success response
            const { password: userPassword,...userData } = newUser.dataValues;
            delete newUser.password;
            return res.status(200).json({ message: "Account created!", data: newUser });

        } catch (error: any) {
            console.log(error);
            return res.status(500).json({ message: "Failed to register user" });
        }
    };

    static async getUsers(req: Request, res: Response) {
        try {
            const users = await db.User.findAll();
            return res.status(200).json(users);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Failed to fetch users" });
        }
    };
     static async loginUser(req:Request,res:Response){
        try {
            const {email,password}=req.body;
            const user= await db.User.findOne({where:{email:email}});
            if(!user) return res.status(400).json({
                status:"fail",
                message:"invalid credentials"
            });
            const validPassword= await bcryptjs.compare(password,user.password);
            if(!validPassword) return res.status(400).json({
                status:"fail",
                message:"invalid credentials"
            })
            const token:string=JWT.signJwt({userId:user.id,isAdmin:user.isAdmin});
             return res.status(200).json({
                status:'success',
                 message:"user login successfully",
                 token
             })

        } catch (error:any) {
            return res.status(500).json({
                status:"error",
                message:error.message
            })
            
        }
     }
    static async setUserRoles(req:Request,res:Response){
        try {
            const{role}=req.body
            if(!role) return res.status(400).json({
                status:"fail",
                message:"role can not be empty"
            })
          const updatedUser= await SetRoles.setRole(req.params.id,role);
          return res.status(200).json({
            status:"success",
            message:"user role updated",
            data:updatedUser
          })
            
        } catch (error:any) {
            return res.status(500).json({
                status:"error",
                message:error.message
            })
            
        }
    }
}