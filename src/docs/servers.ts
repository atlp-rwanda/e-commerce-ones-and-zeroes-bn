import dotenv from 'dotenv';

dotenv.config();

const { PORT, BACKEND_URL } = process.env;
const servers = [
  {
    url: `http://localhost:${PORT}/`,
    description: 'Development server',
  },
  {
    url: `${BACKEND_URL}`,
    description: 'Production server',
  },
];

export default servers;
