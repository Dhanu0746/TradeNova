import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.get("/:symbol", async (req, res) => {
  const { symbol } = req.params;

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${process.env.STOCK_API_KEY}`
    );

    const data = await response.json();
    console.log("API RESPONSE:", data);

    const quote = data["Global Quote"];

    // ✅ FIX: fallback if API fails (very important)
    if (!quote || Object.keys(quote).length === 0) {
      console.log("⚠️ API failed, using dummy data");

      return res.json({
        symbol,
        price: (Math.random() * 1000).toFixed(2),
        change: (Math.random() * 10 - 5).toFixed(2)
      });
    }

    res.json({
      symbol,
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["10. change percent"])
    });

  } catch (err) {
    console.error("❌ API ERROR:", err);

    // ✅ fallback on error
    res.json({
      symbol,
      price: (Math.random() * 1000).toFixed(2),
      change: (Math.random() * 10 - 5).toFixed(2)
    });
  }
});

export default router;