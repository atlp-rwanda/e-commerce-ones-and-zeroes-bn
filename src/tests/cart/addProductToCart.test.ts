import { Request, Response } from 'express';
import CartController from '../../controllers/cartController';
import dotenv from 'dotenv';
import { db } from '../../database/models';

dotenv.config();

jest.mock('../../database/models', () => ({
  db: {
    Cart: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
    Product: {
      findOne: jest.fn(),
    },
    CartProduct: {
      findOne: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('CartController', () => {
  const mockUser: any = {
    userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
    firstName: 'christian',
    lastName: 'Ishimwe',
    email: 'christianinjoooa3@gmail.com',
    role: 'admin',
    isActive: true,
    createdAt: '2024-05-06T18:17:45.933Z',
    updatedAt: '2024-05-06T18:17:45.933Z',
  };

  const mockProduct: any = {
    dataValues: {
      productId: '498ad6c8-4482-4380-a0d5-2303568fd497',
      name: 'snickers',
      price: 1500,
      quantity: 500,
      expiryDate: '2024-05-24T10:01:46.219Z',
      expired: false,
      createdAt: '2024-05-24T10:01:46.219Z',
      updatedAt: '2024-05-24T10:01:46.219Z',
    },
  };

  const mockAnonymousCart: any = {
    dataValues: {
      cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
      userId: null,
      createdAt: '2024-05-24T10:01:46.219Z',
      updatedAt: '2024-05-24T10:01:46.219Z',
    },
  };

  const mockCartProduct: any = {
    dataValues: {
      cartProductId: '172b2bad-3067-48ad-83b8-aa57e528ca0a',
      cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
      productId: mockProduct.dataValues.productId,
      quantity: 80,
    },
  };

  describe('addProduct', () => {
    it('should return error 400 product information is missing', async () => {
      const req = {
        body: {},
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await CartController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Missing or invalid product information',
      });
    });

    it("should return error 404 when product doesn't exist", async () => {
      const req = {
        body: {
          productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
          quantity: 100,
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      (db.Product.findOne as jest.Mock).mockReturnValue(null);

      await CartController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No such product found',
      });
    });

    it('should return error 403 when product is already in the cart', async () => {
      const req = {
        body: {
          productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
          quantity: 100,
        },
        cookies: {
          cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Product.findOne.mockReturnValue(mockProduct);

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne.mockReturnValue(mockCartProduct);

      await CartController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Product is already in the cart',
      });
    });

    it('should return error 403 when product quantity is insufficient', async () => {
      const req = {
        body: {
          productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
          quantity: 1000,
        },
        cookies: {
          cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
        },
      } as unknown as Request;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      db.Product.findOne.mockReturnValue(mockProduct);

      db.Cart.findOne.mockReturnValue(mockAnonymousCart);

      db.CartProduct.findOne.mockReturnValue(null);

      await CartController.addProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Insufficient quantity in stock',
      });
    });

    describe('Product added successfully', () => {
      test('when user is not logged in and no cookies are set', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          cookies: jest.fn(),
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.create.mockReturnValue(mockAnonymousCart);

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('when user is not logged in and a cookie exists', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          cookies: {
            cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue(mockAnonymousCart);

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('when user is not logged in and a cookie exists', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          cookies: {
            cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue(mockAnonymousCart);

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('when user is logged in and no cart is associated with them', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          user: {
            cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue(null);

        db.Cart.findOne.mockReturnValue(mockAnonymousCart);

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test("when user is not logged in and a cookie exists but cart doesn't exist", async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          cookies: {
            cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue(null);

        db.Cart.create.mockReturnValue(mockAnonymousCart);

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('when user is not logged in and a cookie exists but cart exists', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          cookies: {
            cartId: 'b0ac787e-1642-436e-b588-6c597cccf54a',
          },
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue(mockAnonymousCart);

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('when user is logged in but no cart exists', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          user: mockUser,
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue(null);

        db.Cart.create.mockReturnValue({
          ...mockAnonymousCart,
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
        });

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });

      test('when user is logged in but cart exists', async () => {
        const req = {
          body: {
            productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
            quantity: 80,
          },
          user: mockUser,
        } as unknown as Request;

        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
          cookie: jest.fn(),
        } as unknown as Response;

        db.Product.findOne.mockReturnValue(mockProduct);

        db.Cart.findOne.mockReturnValue({
          ...mockAnonymousCart,
          userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
        });

        db.CartProduct.findOne.mockReturnValue(null);

        db.CartProduct.create.mockReturnValue(mockCartProduct);
        await CartController.addProduct(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
      });
    });
  });

  it('returns 500 when error occurs', async () => {
    const req = {
      body: {
        productId: '34571709-53e2-429a-b66a-c1e4cf454cc9',
        quantity: 80,
      },
      user: mockUser,
    } as unknown as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;

    db.Product.findOne.mockReturnValue(mockProduct);

    db.Cart.findOne.mockReturnValue({
      ...mockAnonymousCart,
      userId: 'a91da155-2829-41c5-a4de-95f91b25e9b2',
    });

    db.CartProduct.findOne.mockReturnValue(null);

    db.CartProduct.create.mockImplementation(() => {
      throw new Error('Database Error');
    });
    await CartController.addProduct(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Failed to add product to cart',
    });
  });
});
