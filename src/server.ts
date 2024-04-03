import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express with TypeScript!');
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});