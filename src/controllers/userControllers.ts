import { Request, Response } from "express";
import bcryptjs from "bcrypt";
import { validateEmail, validatePassword } from "../validations/validations";
import { db } from "../database/models";
import { sendEmail } from "../middleware/sendEmail";
import timestamp from "time-stamp";

export default class UserController {
  static async registerUser(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password } = req.body;

      //Validate email and password
      // const validEmail = validateEmail(email);
      // const validPassword = validatePassword(password);

      // if (!validEmail || !validPassword) {
      //     return  res.status(400).json({ message: "Invalid email or password format" });
      // }

      // Check if user with the given email already exists
      const existingUser = await db.User.findOne({ where: { email: email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = bcryptjs.hashSync(password, 10);

      // Create new user
      const newUser = {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      };

      // Create the user in the database
      const registeredUser = await db.User.create(newUser);

      // Send email notification
      const subject = "Welcome to MyBrand";
      const message = "You have signed Up successfully";
      await sendEmail(email, subject, message);

      // Return success response
      return res
        .status(200)
        .json({ message: "Account created!", savedUser: registeredUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to register user" });
    }
  }

  static async getUsers(req: Request, res: Response) {
    try {
      const users = await db.User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
  }
  // get single profile/user controller
  static async getSingleUser(req: Request, res: Response) {
    try {
      const singleUser = await db.User.findOne({
        where: {
          userId: req.params.id,
        },
      });
      if (singleUser) {
        return res.status(200).json({
          status: "User Profile",
          data: singleUser,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "provided ID doen't exist!",
      });
    }
  }
  //update single profile/user
  static async updateSingleUser(req: Request, res: Response) {
    try {
      const singleUser = await db.User.findOne({
        where: {
          userId: req.params.id,
        },
      });
      const {
        firstName,
        lastName,
        gender,
        birthdate,
        preferredLanguage,
        preferredCurrency,
        billingAddress
      } = req.body;
      if(firstName){
        singleUser.firstName = firstName
      }
      if(lastName){
        singleUser.lastName = lastName
      }
      if(gender){
        singleUser.gender = gender
      }
      if(birthdate){
        singleUser.birthdate = birthdate
      }
      if(preferredLanguage){
        singleUser.preferredLanguage = preferredLanguage
      }
      if(preferredCurrency){
        singleUser.preferredCurrency = preferredCurrency
      }
      if(billingAddress){
        singleUser.billingAddress = billingAddress
      }
      singleUser.updatedAt = new Date();

      await singleUser.save();
      return res.status(200).json({
        status: "Profile updated successfully",
        data: singleUser,
      });
    } catch (err: any) {
        return res.status(500).json({
          status: "internal server error",
          error: err.message
        });
      }
  }
}
