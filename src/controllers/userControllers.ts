import { Request, Response } from "express";
import { db } from "../database/models/index";
import bcrypt from "bcryptjs";
import { JWT } from "../helps/jwt";


export default class userControllers {

    
    static async getUsers(req: any, res: Response){
        try{
            const users = await db.User.findAll()
            console.log(req.token)
            return res.status(200).json({
                status: "OK",
                message: "success",
                data: users
            })
        }catch(e){
            return res.status(500).json({
                status: "fail",
                message: e
            })
        }
    }

    static async editUsers(req: Request, res: Response){
        const { id } = req.params;
        const newFullName = req.body.fname;
        const newLastName = req.body.lname;

        try{

            const user = await db.User.findByPk(id)
            if(!user){
                throw new Error(`User with id ${id} cannot be found`)
            }

            const updateUser = await db.User.update(
                { firstName : newFullName },
                { where: { userId : id } }
            )

            
            if(updateUser){
                console.log(updateUser)
                return res.status(200).json({ message: "OK"})
            }

            return res.status(200).json({
                status: "fail"
            })
            
            // const [updatedUser] = await db.User.update(
            //     {
            //       firstName: newFullName,
            //       lastName: newLastName,
            //     },
            //     {
            //       where: { userId: id },
            //     }
            //   ); 
              
            //   if (updatedUser > 0) {
            //     const returnUpdatedUser = await db.User.findOne({ where: { userId: id } });
            //     res.status(200).json({
            //       status: "OK",
            //       message: "User Updated succesfully",
            //       data: returnUpdatedUser,
            //     });
            //   } else {
                
            //     console.error(updatedUser)
            //     res.status(404).json({ message: "User not found" });
            //   }

        }catch(e: any){
            console.error(e)
            return res.status(500).json({
                status: "fail",
                message: "something went wrong: " + e.mesage
            })
        }
    }

    static async getUserById(req: Request, res: Response){
        const { id } = req.params
        try {
            const user = await db.User.findOne({where : {userId : id}})
            if(user){
                return res.status(200).json({
                    status: "ok",
                    data: user
                })
            }else{
                return res.status(400).json({
                    status : "fail"
                })
            }
        }catch(e){
            console.error(e)
            return res.status(500).json({error: e})
        }
    }

    static async addUser(req: Request, res: Response){

        
        try{
            const fname = req.body.fname;
            const lname = req.body.lname;
            const email = req.body.email;
            const password = req.body.password;

            const newEmail = email.toLowerCase()

            // hashpassword
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const newHashPassword = bcrypt.hashSync(password, salt);

            const user = await db.User.create({
                firstName: fname,
                lastName: lname,
                email: newEmail,
                password: newHashPassword
              });  

              if(user){
                return res.status(200).json({
                    status: "OK",
                    data: user
                })
            }

            return res.status(403).json({
                status: "fail",
                message: "User can't be added"
            })


        }catch(e){
            console.error(e)
            return res.status(500).json({
                status : "fail",
                mesage : e
            })
        }
    }

    //create a login
    static async login(req: Request, res: Response){
        const { email, password} = req.body;
        const newEmail  = email.toLowerCase()

        try {
            const isUserExist = await db.User.findOne({
                where: {email : newEmail}
            })

            console.log(isUserExist)

            if(isUserExist == null){
                return res.status(404).json({
                    status: "fail",
                    message: "User not found",
                  });   
            }

            const isValidPassword = bcrypt.compareSync(password, isUserExist.password)
            if(!isValidPassword){
                
                return res.status(400).json({
                    status : "fail",
                    message: "Wrong credentials"
                })
            }

            const token = JWT.generateJwt({
              userId : isUserExist.userId,
              email : isUserExist.email,
              name : isUserExist.firstName,  
            });

            return res.status(200).json({
                status : "OK",
                message: "login succssefully",
                token,
            })



            


        }catch(e){
            console.error(e)
            return res.status(500).json({
                status: "fail: something went wrong",
                message: e
            })
        }
    }

    static async updatePassword(req: any, res: Response){
        const {token} = req;
        const { password, newPassword, verifyNewPassword } = req.body;
        const userId = token.userId;

        try{

            // return res.status(200).json({
            //     data : token.userId
            // })

            const userData = await db.User.findOne({
                where: { userId : userId }
            })

            if(!userData){
                return res.status(404).json({
                    status: "fail",
                    message: "User not found"
                })
            }

              //extract Hash Password frm user detail
      const currentHash = userData.dataValues.password;
      const validCheckPassword = bcrypt.compareSync(password, currentHash);

      if(!validCheckPassword){
        return res.status(401).json({
            status: "fail",
            message : "Wrong credentials"
        })        
      }

      if(newPassword !== verifyNewPassword){
        return res.status(400).json({
            status: "fail",
            message: " new password mismacth with confirm new password"
        })
      }

      //hashNewPassword
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const newHashPassword = bcrypt.hashSync(newPassword, salt);

      const [updatePassword] = await db.User.update(
        {  password : newHashPassword },
        {where : { userId : userId }}
    
    )

    if(updatePassword > 0){
        return res.status(200).json({
            status: "OK",
            message: "Password updated successfully"
        })
    }

    return res.status(501).json({
        status: "fail",
        message : "Failed to update password"
    })


        }catch(e){
            res.status(500).json({
                status: "fail",
                message : "something went wrong: " + userId
            })
        }



    }
}
