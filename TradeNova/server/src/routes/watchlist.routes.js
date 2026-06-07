import express from "express";

const router = express.Router();

// TEMP in-memory storage
let watchlist = [];

// ➕ Add stock
router.post("/", (req, res) => {
  const { symbol } = req.body;

  if (!symbol) {
    return res.status(400).json({ message: "Symbol required" });
  }

  if (!watchlist.includes(symbol)) {
    watchlist.push(symbol);
  }

  res.json({ watchlist });
});

// 📥 Get watchlist
router.get("/", (req, res) => {
  res.json({ watchlist });
});

export default router;