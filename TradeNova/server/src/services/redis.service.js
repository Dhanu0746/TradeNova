import { createClient } from 'redis';
import { config } from '../config.js';

let redisClient = null;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: config.redisUrl,
      socket: {
        reconnectStrategy: false
      }
    });
    redisClient.on('error', (err) => console.warn('Redis connection warning:', err.message || err));
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.warn('Redis not available, running without caching:', error.message || error);
    redisClient = null;
  }
};

export const cacheMarketData = async (symbol, data, ttl = 30) => {
  if (!redisClient) return;
  try {
    await redisClient.setEx(`market:${symbol}`, ttl, JSON.stringify(data));
  } catch (error) {
    console.warn('Redis cache error:', error.message || error);
  }
};

export const getCachedMarketData = async (symbol) => {
  if (!redisClient) return null;
  try {
    const value = await redisClient.get(`market:${symbol}`);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.warn('Redis cache read error:', error.message);
    return null;
  }
};
