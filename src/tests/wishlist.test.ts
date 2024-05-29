import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import WishlistController from '../controllers/wishlist'; // Adjust the import path accordingly
import { authenticate } from '../middleware/wishlist'; // Adjust the import path accordingly
import { db } from '../database/models'; // Adjust the import path accordingly

dotenv.config();
const secret = process.env.JWT_SECRET as string;

const app = express();
app.use(express.json());
app.use(authenticate);
app.post('/wishlist/:productId', WishlistController.addToWishlist);
app.delete('/wishlist/:productId', WishlistController.deleteFromWishlist);
app.get('/wishlist', WishlistController.getWishlist);
app.delete('/wishlist', WishlistController.clearWishlist);

// Mocking the db models
jest.mock('../database/models', () => {
  return {
    db: {
      Product: {
        findOne: jest.fn(),
      },
      Wishlist: {
        findOne: jest.fn(),
        create: jest.fn(),
        findAll: jest.fn(),
        destroy: jest.fn(),
      },
    },
  };
});

const token = jwt.sign({ userId: '1' }, secret);

describe('WishlistController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('should add a product to the wishlist', async () => {
      db.Product.findOne.mockResolvedValue({ id: '1' });
      db.Wishlist.findOne.mockResolvedValue(null);
      db.Wishlist.create.mockResolvedValue({ userId: '1', productId: '1' });

      const res = await request(app)
        .post('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Product added to your wishlist');
    });

    it('should return 404 if product not found', async () => {
      db.Product.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Product not found');
    });

    it('should return 400 if product is already in wishlist', async () => {
      db.Product.findOne.mockResolvedValue({ id: '1' });
      db.Wishlist.findOne.mockResolvedValue({ userId: '1', productId: '1' });

      const res = await request(app)
        .post('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Product already in your wishlist');
    });

    it('should return 500 if there is an error', async () => {
      db.Product.findOne.mockRejectedValue(
        new Error('Failed to add product to wishlist'),
      );

      const res = await request(app)
        .post('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Failed to add product to wishlist');
    });
  });

  describe('deleteFromWishlist', () => {
    it('should delete a product from the wishlist', async () => {
      db.Wishlist.findOne.mockResolvedValue({ destroy: jest.fn() });

      const res = await request(app)
        .delete('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Product removed from your wishlist');
    });

    it('should return 404 if wishlist item not found', async () => {
      db.Wishlist.findOne.mockResolvedValue(null);

      const res = await request(app)
        .delete('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Wishlist item not found');
    });

    it('should return 500 if there is an error', async () => {
      db.Wishlist.findOne.mockRejectedValue(
        new Error('Failed to remove product from wishlist'),
      );

      const res = await request(app)
        .delete('/wishlist/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Failed to remove product from wishlist');
    });
  });

  describe('getWishlist', () => {
    it('should return the wishlist', async () => {
      db.Wishlist.findAll.mockResolvedValue([
        { productId: '1', product: { name: 'Product 1', price: 100 } },
      ]);

      const res = await request(app)
        .get('/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { productId: '1', product: { name: 'Product 1', price: 100 } },
      ]);
    });

    it('should return 200 if no items in wishlist', async () => {
      db.Wishlist.findAll.mockResolvedValue([]);

      const res = await request(app)
        .get('/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('no items in your wishlist');
    });

    it('should return 500 if there is an error', async () => {
      db.Wishlist.findAll.mockRejectedValue(
        new Error('Failed to fetch wishlist'),
      );

      const res = await request(app)
        .get('/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.error).toBe('Failed to fetch wishlist');
    });
  });

  describe('clearWishlist', () => {
    it('should clear the wishlist', async () => {
      db.Wishlist.destroy.mockResolvedValue(1);

      const res = await request(app)
        .delete('/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Wishlist cleared successfully');
    });

    it('should return 500 if there is an error', async () => {
      db.Wishlist.destroy.mockRejectedValue(
        new Error('Failed to clear wishlist'),
      );

      const res = await request(app)
        .delete('/wishlist')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Failed to clear wishlist');
    });
  });
});

describe('authenticate middleware', () => {
  it('should allow access with valid token', async () => {
    const testApp = express();
    testApp.use(authenticate);
    testApp.get('/test', (req, res) =>
      res.status(200).json({ message: 'success' }),
    );

    const res = await request(testApp)
      .get('/test')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('success');
  });

  it('should deny access with no token', async () => {
    const testApp = express();
    testApp.use(authenticate);
    testApp.get('/test', (req, res) =>
      res.status(200).json({ message: 'success' }),
    );

    const res = await request(testApp).get('/test');

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Unauthorized token');
  });

  it('should deny access with invalid token', async () => {
    const testApp = express();
    testApp.use(authenticate);
    testApp.get('/test', (req, res) =>
      res.status(200).json({ message: 'success' }),
    );

    const res = await request(testApp)
      .get('/test')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Unauthorized');
  });
});
describe('WishlistController edge cases', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addToWishlist', () => {
    it('should return 401 if userId is not present', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/wishlist/:productId', WishlistController.addToWishlist);

      const res = await request(testApp).post('/wishlist/1');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });
  });

  describe('deleteFromWishlist', () => {
    it('should return 400 if userId or productId is not present', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.use((req, res, next) => {
        res.locals.userId = '1'; // Mock userId
        next();
      });
      testApp.delete(
        '/wishlist/:productId',
        WishlistController.deleteFromWishlist,
      );

      const res = await request(testApp).delete('/wishlist/');
      expect(res.status).toBe(404);
      expect(res.body.message).toBe(undefined);
    });
  });

  describe('clearWishlist', () => {
    it('should return 401 if userId is not present', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.delete('/wishlist', WishlistController.clearWishlist);

      const res = await request(testApp).delete('/wishlist');
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });
  });
});
