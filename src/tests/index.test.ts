import express, { Router, Request, Response } from 'express';
import request from 'supertest'; // Import the request function from supertest

const app = express();
const router = Router(); // Create a new Router instance

// Define your routes
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'success' });
});

app.use('/', router);

test('GET / should return status 200 and a JSON response', async () => {
  const response = await request(app).get('/');
  
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'success' });
});
