import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { fetchStockQuote } from '../services/stock.service.js';

const router = express.Router();

router.post('/signal', protect, async (req, res) => {
  const { symbol, timeframe, riskProfile } = req.body;
  if (!symbol) {
    return res.status(400).json({ message: 'Symbol is required.' });
  }

  let marketData = null;
  try {
    marketData = await fetchStockQuote(symbol);
  } catch (error) {
    console.warn('Advisor warning: unable to fetch market data', error.message);
  }

  const recommendation = marketData?.price > 0 ? 'hold' : 'hold';

  const signal = {
    symbol,
    recommendation,
    reason:
      'This is a placeholder signal. Integrate a real AI model or trading rule engine for live guidance.',
    timeframe: timeframe || 'intraday',
    riskProfile: riskProfile || 'moderate',
    marketData
  };

  res.json({ signal });
});

export default router;
