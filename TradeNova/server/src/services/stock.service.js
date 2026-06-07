import fetch from 'node-fetch';
import { config } from '../config.js';
import { cacheMarketData, getCachedMarketData } from './redis.service.js';

export const fetchStockQuote = async (symbol) => {
  const cached = await getCachedMarketData(symbol);
  if (cached) {
    return cached;
  }

  const url = `${config.stockApiUrl}?symbol=${encodeURIComponent(symbol)}&apikey=${config.stockApiKey}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch stock quote');
  }

  const data = await response.json();
  await cacheMarketData(symbol, data, 20);
  return data;
};
