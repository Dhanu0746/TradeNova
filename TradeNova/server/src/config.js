import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tradenova',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  stockApiKey: process.env.STOCK_API_KEY || '',
  stockApiUrl: process.env.STOCK_API_URL || 'https://api.example.com/stock'
};
