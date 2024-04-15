import dotenv from 'dotenv';

dotenv.config();

const { PORT } = process.env;
const servers = [
  {
    url: `http://localhost:${PORT}/`,
    description: 'Development server',
  },
  {
    url: 'backend uri',
    description: 'Production server',
  },
];

export default servers;
