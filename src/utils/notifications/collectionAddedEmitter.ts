import { collectionEmailTemplate, transporter } from "./nodemailerConfig";
const EventEmitter = require('events');
const nodemailer = require('nodemailer')

import 'dotenv/config'
import { collectionNotification } from "./saveToDb";
import { db } from "../../database/models";





const { NODEMAILER_EMAIL_USERNAME } = process.env;
const collectionEmitter = new EventEmitter();
collectionEmitter.on('created', async (data: any) => {




    const mailOptions = {
        from: `E-COMMERCE-ONES-AND-ZEROES <${NODEMAILER_EMAIL_USERNAME}>`,
        to: data.email,
        subject: 'New Collection Created',
        html: collectionEmailTemplate(data)
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) {
            return console.log('Error occurred: ', error);
        }
        console.log('Email sent: ', info.response);
    });

    try {
        const save = await collectionNotification(data)
        console.log("notification for adding collection saved to DB")
    } catch (e) {
        console.error('Error Saving notification to DB', e)
    }


})

export { collectionEmitter }