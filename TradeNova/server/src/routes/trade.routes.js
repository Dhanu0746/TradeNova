import express from "express";
import Portfolio from "../models/portfolio.model.js";
import { protect } from "../middleware/auth.middleware.js";
import { publishMessage } from "../services/rabbitmq.service.js";

const router = express.Router();

// 📊 GET portfolio
router.get("/", protect, async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({ userId: req.user.id }); // ✅ FIX

    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId: req.user.id,   // ✅ FIX
        balance: 10000,
        holdings: []
      });
    }

    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 💰 BUY
router.post("/buy", protect, async (req, res) => {
  try {
    const { symbol, price } = req.body;

    // Send to message queue instead of blocking execution
    await publishMessage('trade_queue', {
      action: 'buy',
      symbol: symbol.toUpperCase(),
      price,
      userId: req.user.id
    });

    res.json({ message: "Buy order received and queued for processing" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 💸 SELL
router.post("/sell", protect, async (req, res) => {
  try {
    const { symbol, price } = req.body;

    // Send to message queue
    await publishMessage('trade_queue', {
      action: 'sell',
      symbol: symbol.toUpperCase(),
      price,
      userId: req.user.id
    });

    res.json({ message: "Sell order received and queued for processing" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;