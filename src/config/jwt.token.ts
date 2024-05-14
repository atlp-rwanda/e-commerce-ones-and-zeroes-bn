const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const secretKey = process.env.SECRET_KEY;
const options = { expiresIn: '1w' };

export const registerToken = (userPayload: any) => {
  const token = jwt.sign(userPayload, secretKey, options);
  return token;
};

export const authenticateToken = (req: any, res: any, next: () => void) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).send('Login required');
  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token Expired' });
      } else {
        return res.status(401).json({ message: 'Invalid Token' });
      }
    }
    req.user = user;
    next();
  });
};
