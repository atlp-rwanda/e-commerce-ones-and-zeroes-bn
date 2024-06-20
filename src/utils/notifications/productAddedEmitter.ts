const EventEmitter = require('events');
const nodemailer = require('nodemailer')
import dotenv from 'dotenv';
import { addProductEmailtemplate, transporter } from './nodemailerConfig';
import { ProductNotification } from './saveToDb';
import sendEmail from '../../helps/nodemailer';
dotenv.config();


const { NODEMAILER_EMAIL_USERNAME } = process.env;

const productEmitter = new EventEmitter();

productEmitter.on('created', async (data: any) => {

    const userId = data.userInfo.userId;
    const firstName = data.userInfo.firstName;
    const email = data.userInfo.email;
    const productName = data.product.name;
    const price = data.product.price;
    const category = data.product.category;
    const quantity = data.product.quantity;
    const expiryDate = data.product.expiryDate;

    const emailData = {
        userId,
        firstName,
        email,
        productName,
        price,
        category,
        quantity,
        expiryDate
    }



    const mailOptions = {
        from: `E-COMMERCE-ONES-AND-ZEROES <${NODEMAILER_EMAIL_USERNAME}>`,
        to: emailData.email,
        subject: 'New Product Added',
        html: addProductEmailtemplate(emailData)
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return console.log('Error occurred: ', error);
        }
        console.log('Email sent: ', info.response);
    });

    try {
        const save = await ProductNotification(emailData)
        console.log("notification for adding product saved to DB")
    } catch (e) {
        console.error('Error Saving notification to DB', e)
    }





})

export { productEmitter }