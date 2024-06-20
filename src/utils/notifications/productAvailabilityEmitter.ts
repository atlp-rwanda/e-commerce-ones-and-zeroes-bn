const EventEmitter = require('events');
const nodemailer = require('nodemailer')
import dotenv from 'dotenv';
import { productAvailabilityEmailTemplate, transporter } from './nodemailerConfig';
import { ProductAvailableNotification } from './saveToDb';
dotenv.config();



const { NODEMAILER_EMAIL_USERNAME } = process.env;
const productAvailabilityEmitter = new EventEmitter();

productAvailabilityEmitter.on('updated', async (data: any) => {
    // console.log(JSON.stringify(data.userInfo))
    // console.log(JSON.stringify(data.product))

    const { firstName, email, userId } = data.userInfo;
    const { name, price, quantity, expiryDate } = data.product;
    const newStatus = data.productStatus;

    const emailData = {
        userId,
        firstName,
        name,
        price,
        quantity,
        expiryDate,
        newStatus
    }

    const mailOptions = {
        from: `E-COMMERCE-ONES-AND-ZEROES <${NODEMAILER_EMAIL_USERNAME}>`,
        to: email,
        subject: 'Product status changed',
        html: productAvailabilityEmailTemplate(emailData)
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return console.log('Error occurred: ', error);
        }
        console.log('Email sent: ', info.response);
    });

    try {
        const save = await ProductAvailableNotification(emailData)
        console.log("notification for updating a product status saved to DB")
    } catch (e) {
        console.error('Error Saving notification to DB', e)
    }
})

export { productAvailabilityEmitter };