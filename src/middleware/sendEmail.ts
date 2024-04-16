
const nodemailer = require('nodemailer');

export const sendEmail = async (email:any, subject:any, text:any) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host:'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'kayitesililiane73@gmail.com',
                pass: 'pnseyximagwshbkj',
                
            },
        });

        const options = {
            from: "kayitesililiane73@gmail.com",
            to: email,
            subject: subject,
            text: text
        };

        await transporter.sendMail(options, function(error:any, infor:any) {
            if (error) {
                console.log("Failed to save email: "+error);
                return error;
            } else {
                console.log("Email Sent: "+infor.response);
                return "Email Sent: "+infor.response;
            }
        });
    } catch (error) {
        console.log(error);
        return error;
    }
}

