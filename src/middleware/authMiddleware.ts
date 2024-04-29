import jwt,{Secret,JwtPayload} from 'jsonwebtoken'
import { Request,Response,NextFunction} from 'express'
import dotenv from 'dotenv'

export  default class  AuthMiddleware{
    static async isAuthenticated(req: Request, res: Response, next: NextFunction){
        try {
          const { authorization } = req.headers;
          if (!authorization) {
            return res.status(401).json({
              status: "fail",
              message: "No token provided"
            });
          }
      
          const token: string = authorization.split(' ')[1];
          if (!token) {
            return res.status(401).json({
              status: 'fail',
              message: "Unauthorized action"
            });
          }
      
          const secretKey: Secret = process.env.JWT_SECRET as Secret;
          const decoded = jwt.verify(token, secretKey);
  
          (req as any).user = decoded;
           return next();
        } catch (error:any) {
           return res.status(500).json({
            status: 'error',
            message: error.message
          });
        }
      }  
      
 static async checkRole(req:Request,res:Response, next:NextFunction){
    const user=(req as any).user;
    if(!user.isAdmin){
      return res.status(401).json({
        status:"fail",
        message:"not have permission to perform this action."
    })
 }
 return next();
}
}