
import { Request, Response } from "express"
const jwt = require("jsonwebtoken")


export default class authMiddleWares {
    static async isAuthenticated(req: any, res: Response, next: any){
        try{

            const { authorization } = req.headers;
            if (!authorization) {
              return res.status(401).json({
                status: "fail",
                message: "Missing authorization token",
              });
            } 
            
            const token = authorization.split(" ")[1];


      if (!token) {
        return res.status(401).json({
          status: "fail",
          message: "unauthorized action",
        });
      }

      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.token = user;
      next();

        }catch(e){
            return res.status(500).json({
                status: "error",
                message: "something went wrong: " + e
            })
        }
    }
    
}