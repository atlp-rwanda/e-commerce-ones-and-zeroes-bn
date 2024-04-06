import { Request, Response } from 'express';
import bcryptjs from 'bcrypt';
import {UserModel} from '../models/user.model.js'

const registerUser: (request: Request, response: Response) => Promise<Response> = async (request, response) => {
  try {
      const { fullName, email, password } = request.body;
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
          return response.json({ "Message": `User with this email ${email} already exists` });
      }
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const user = new UserModel({
          fullName,
          email,
          password: hashedPassword
      });
      await user.save();
      return response.status(201).json({ message: "Account created succesfully", data: user })

  } catch (error) {
      console.log(error);
      
      return response.sendStatus(400);
  }
}

export default registerUser;
