const nodemailer = require('nodemailer');
import dotenv from 'dotenv';
dotenv.config();

const { NODEMAILER_EMAIL_USERNAME, NODEMAILER_EMAIL_PASSWORD, PORT } =
  process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: NODEMAILER_EMAIL_USERNAME,
    pass: NODEMAILER_EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

//Email template for creating a collection
const collectionEmailTemplate = (data: any) => `
    <html>
    <body>
        <div
      style="
        width: 90%;
        margin: 0 auto;

        padding: 20px;
        font-family: Arial, sans-serif;
      "
    >
      <div
        style="
          text-align: center;
          background-color: #0857a8;
          padding: 20px;
          color: white;
          font-size: 15px;
          font-weight: bold;
        "
      >
        <p>Ones and Zeros e-commerce</p>
      </div>
      <div
        style="
          background-color: #f9fdfc;
          padding: 20px 40px;
          color: rgb(73, 73, 73);
          font-size: 14px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
        "
      >
        <h4>Dear ${data.firstName},</h4>
        <p style="margin-top: 30px">
          Your new collection has been succsesfully created
        </p>
        <div style="margin-top: 40px; display: flex; gap: 2px">
          <div
            style="
              padding: 10px;
              flex: 1;
              ;
            "
          >
            Collection name:
          </div>
          <div style="flex: 1; padding: 10px; font-weight: bold">
            ${data.collectionName}
          </div>
        </div>
        <div style="display: flex; gap: 2px; margin-top: 5px">
          <div
            style="
              padding: 10px;
              flex: 1;
              
            "
          >
            Creation Date:
          </div>
          <div style="padding: 10px; flex: 1; font-weight: bold">
            ${data.created}
          </div>
        </div>
        <p style="margin: 40px 0">Thank you for shopping with us!</p>
      </div>
      <div
        style="
          text-align: center;
          background-color: #0857a8;
          padding: 20px;
          color: white;
          font-size: 10px;
          font-weight: bold;
        "
      >
        <p>&copy; one's and zero's - All rights reserved</p>
      </div>
    </div>
    </body>
    </html>
`;

//Email template for creating a collection
const addProductEmailtemplate = (data: any) => `
    <html>
  <body>
    <div
      style="
        width: 90%;
        margin: 0 auto;

        padding: 20px;
        font-family: Arial, sans-serif;
      "
    >
      <div
        style="
          text-align: center;
          background-color: #0857a8;
          padding: 20px;
          color: white;
          font-size: 15px;
          font-weight: bold;
        "
      >
        <p>Ones and Zeros e-commerce</p>
      </div>
      <div
        style="
          background-color: #f9fdfc;
          padding: 20px 40px;
          color: rgb(73, 73, 73);
          font-size: 14px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
        "
      >
        <h4>Dear ${data.firstName},</h4>
        <p style="margin: 30px 0">
          a new product has been added to your collection
        </p>

        <div
          style="
            margin-top: 10px;
            display: flex;
            gap: 2px;
            border-bottom: 1px solid rgb(248, 242, 242);
          "
        >
          <div style="padding: 10px; flex: 1">Product name:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.productName}
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            display: flex;
            gap: 2px;
            border-bottom: 1px solid rgb(248, 242, 242);
          "
        >
          <div style="padding: 10px; flex: 1">Product price:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.price}
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            display: flex;
            gap: 2px;
            border-bottom: 1px solid rgb(248, 242, 242);
          "
        >
          <div style="padding: 10px; flex: 1">Product Category:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.category}
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            display: flex;
            gap: 2px;
            border-bottom: 1px solid rgb(248, 242, 242);
          "
        >
          <div style="padding: 10px; flex: 1">Product quantity:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.quantity}
          </div>
        </div>
        <div
          style="
            margin-top: 10px;
            display: flex;
            gap: 2px;
            border-bottom: 1px solid rgb(248, 242, 242);
          "
        >
          <div style="padding: 10px; flex: 1">Expiration date:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.expiryDate}
          </div>
        </div>

        <p style="margin: 40px 0">Thank you for shopping with us!</p>
      </div>
      <div
        style="
          text-align: center;
          background-color: #0857a8;
          padding: 20px;
          color: white;
          font-size: 10px;
          font-weight: bold;
        "
      >
        <p>&copy; one's and zero's - All rights reserved</p>
      </div>
    </div>
  </body>
</html>
`;

const productAvailabilityEmailTemplate = (data: any) => `
    <html>
  <body>
    <div
      style="
        width: 90%;
        margin: 0 auto;

        padding: 20px;
        font-family: Arial, sans-serif;
      "
    >
      <div
        style="
          text-align: center;
          background-color: #0857a8;
          padding: 20px;
          color: white;
          font-size: 15px;
          font-weight: bold;
        "
      >
        <p>Ones and Zeros e-commerce</p>
      </div>
      <div
        style="
          background-color: #f9fdfc;
          padding: 20px 40px;
          color: rgb(73, 73, 73);
          font-size: 14px;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px;
        "
      >
        <h4>Dear ${data.firstName},</h4>
        <p style="margin: 30px 0">Your Product status has changed</p>

        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product name:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.name}
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product Status:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.newStatus}
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product Price:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.price}
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product Quantity:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.quantity}
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Expiration date:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            ${data.expiryDate}
          </div>
        </div>

        <p style="margin: 40px 0">Thank you for shopping with us!</p>
      </div>
      <div
        style="
          text-align: center;
          background-color: #0857a8;
          padding: 20px;
          color: white;
          font-size: 10px;
          font-weight: bold;
        "
      >
        <p>&copy; one's and zero's - All rights reserved</p>
      </div>
    </div>
  </body>
</html>
`;

export {
  collectionEmailTemplate,
  addProductEmailtemplate,
  productAvailabilityEmailTemplate,
  transporter,
};
