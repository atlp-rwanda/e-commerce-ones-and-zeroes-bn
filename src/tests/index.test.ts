import express, { Router, Request, Response } from 'express';
import request from 'supertest'; 
import exampleRoutes from '../routes/exampleRoutes'; 

const app = express();


app.use('/', exampleRoutes);

test('GET / should return status 200 and a JSON response', async () => {
  const response = await request(app).get('/');
  
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'sucess' });
});
