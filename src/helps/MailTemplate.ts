const millisecondsToDate = require('./datesConversion');
import dotenv from 'dotenv';
dotenv.config();

export const sendChangePasswordNotificationMail = (
  userToken: any,
  userName: string,
) => `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #ffffff;
      padding: 20px;
    }
    .email-container {
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
      border: 1px solid #FF6D18 ;
    }
    .email-content p {
      color: #666666;
      text-align: justify;
    }
    .email-content a {
      display: inline-block;
      width: 200px;
      margin: 20px auto;
      text-align: center;
      background-color: #0F1848;
      color: #ffffff;
      text-decoration: none;
      padding: 10px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .email-content a:hover {
      background-color: #FF6D18;
    }
    .email-content p.center {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-content">
    
        <p style="color: #666666; text-align: left;">Dear ${userName},</p>
      <p>We are writing to inform you that it is necessary to update your password for security purposes.</p>
      <p>Failure to update your password will result in the inability to perform any actions until the update is completed.</p>
      <p>Please follow the link below to proceed with the password update:</p>
      <p class="center">
        <a href="${process.env.CLIENT_URL}/reset/new-password?q=${userToken}">Update Password</a>
      </p>
      <p class="center">Thank you for your prompt attention to this matter.</p>
      <p class="center">Sincerely,</p>
      <p class="center">OnesAndZeroes Support Team</p>
    </div>
  </div>
</body>
</html>

`;
export const sendExpiredEmail = (products: any[]) => {
  const productRows = products
    .map((product) => {
      let date = new Date(product.expiryDate).toDateString();
      return `
      <tr>
        <td>${product.name}</td>
        <td>${date}</td>
        <td>${product.quantity}</td>
        <td><a href="${product.images[0]}" target="_blank"><img src="${product.images[0]}" alt="Product Image"></a></td>
      </tr>`;
    })
    .join('');

  let html = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Expiry Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
        }
        h1 {
            color: #333;
        }
        p {
            color: #666;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }
        img {
            max-width: 100px;
            max-height: 100px;
        }
    </style>
    </head>
    <body>
        <div class="container">
            <p>We are writing to inform you that the following products on the market have expired. Please take immediate action to update or remove the expired products to avoid any inconvenience to your customers.</p>
            <table>
                <tr>
                    <th>Product Name</th>
                    <th>Expiry Date</th>
                    <th>Quantity</th>
                    <th>Image</th>
                </tr>
                ${productRows}
            </table>
            <p>If you have any questions or need assistance, please feel free to contact us.</p>
            <p>Thank you for your attention to this matter.</p>
            <p>Sincerely,<br>o's and 1's Ecommerce Team</p>
        </div>
    </body>
    </html>`;
  return html;
};
