import request from 'supertest';
import express, { Express } from 'express';
import { SearchController } from '../../controllers/productSearch';
import { db } from '../../database/models';
const app: Express = express();
app.use(express.json());
app.get('/search/:searchKeyword', SearchController.search);

jest.mock('../../database/models', () => ({
  db: {
    Product: {
      findAll: jest.fn(),
    },
  },
}));

describe('SearchController', () => {
  it('should return products matching the search keyword', async () => {
    db.Product.findAll.mockResolvedValue([
      { name: 'Test Product', category: 'TestCategory', price: 100 },
    ]);

    const response = await request(app).get('/search/test');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'Test Product', category: 'TestCategory', price: 100 },
    ]);
  });

  it('should return products within the price range', async () => {
    db.Product.findAll.mockResolvedValue([
      { name: 'Test Product', category: 'TestCategory', price: 100 },
    ]);

    const response = await request(app).get(
      '/search/test?minPrice=50&maxPrice=150',
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { name: 'Test Product', category: 'TestCategory', price: 100 },
    ]);
  });

  it('should return 500 if there is an internal server error', async () => {
    db.Product.findAll.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/search/test');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      message: 'Internal server error',
      error: expect.any(Object),
    });
  });
});
