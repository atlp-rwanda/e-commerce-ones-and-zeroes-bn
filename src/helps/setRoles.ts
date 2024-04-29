
import {Request,Response} from 'express';
import { db } from '../database/models';

export default class SetRoles{
 static async setRole(userId:string,role:string):Promise<void>{
    try {
        let user = await db.User.findOne({where:{userId:userId}});
        if(!user) throw new Error("User not found");
        user= await user.update({role:role});
        return user;
        
    } catch (error:any) {
        console.error('Error setting roles for users',error)
        throw error;
    }
  
 }

}
