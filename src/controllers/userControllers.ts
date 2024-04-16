import { Request, Response } from 'express';
import bcryptjs from 'bcrypt';
import {  validateEmail, validatePassword } from '../validations/validations';
import { db } from "../database/models";
import { sendEmail } from '../middleware/sendEmail';

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
                password: hashedPassword
            };

            // Create the user in the database
            const registeredUser = await db.User.create(newUser);

            // Send email notification
            const subject = "Welcome to MyBrand";
            const message = "You have signed Up successfully";
            await sendEmail(email, subject, message);

            // Return success response
            return res.status(200).json({ message: "Account created!", savedUser: registeredUser });

        } catch (error) {
            console.error(error);
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
}

