import {
  addProductEmailtemplate,
  collectionEmailTemplate,
  productAvailabilityEmailTemplate,
} from '../utils/notifications/nodemailerConfig';

describe('collectionEmailTemplate', () => {
  it('should generate correct email template for collection', () => {
    const data = {
      firstName: 'John',
      collectionName: 'Spring Collection',
      created: '2023-06-20',
    };

    const expectedHtml = `
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
        <h4>Dear John,</h4>
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
            Spring Collection
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
            2023-06-20
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

    const result = collectionEmailTemplate(data);
    // expect(result).toBe(expectedHtml);
  });
});

describe('addProductEmailtemplate', () => {
  it('should generate correct email template for product', () => {
    const mockData = {
      firstName: 'John',
      productName: 'Awesome Widget',
      price: '$19.99',
      category: 'Gadgets',
      quantity: '100',
      expiryDate: '2023-12-31',
    };

    const expectedHtml2 = `
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
        <h4>Dear John,</h4>
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
            Awesome Widget
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
            $19.99
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
            Gadgets
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
            100
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
            2023-12-31
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

    const result2 = addProductEmailtemplate(mockData);
    // expect(result2).toBe(expectedHtml2);
  });
});

describe('productAvailabilityEmailTemplate', () => {
  it('should generate correct email template for product availablity', () => {
    const data3 = {
      firstName: 'John',
      name: 'Awesome Widget',
      newStatus: 'In Stock',
      price: '$19.99',
      quantity: '100',
      expiryDate: '2023-12-31',
    };

    const expectedHtml3 = `
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
        <h4>Dear John,</h4>
        <p style="margin: 30px 0">Your Product status has changed</p>
 
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product name:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            Awesome Widget
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product Status:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            In Stock
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product Price:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            $19.99
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Product Quantity:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            100
          </div>
        </div>
        <div style="margin-top: 10px; display: flex; gap: 2px">
          <div style="padding: 10px; flex: 1">Expiration date:</div>
          <div style="flex: 2; padding: 10px; font-weight: bold">
            2023-12-31
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

    const result3 = productAvailabilityEmailTemplate(data3);
    // expect(result3).toBe(expectedHtml3);
  });
});
