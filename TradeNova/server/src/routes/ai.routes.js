import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import Portfolio from "../models/portfolio.model.js";
import { redis } from "../utils/redis.js";

const router = express.Router();

// 🔹 similarity function
const similarity = (a, b) => {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
  const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
  return dot / (magA * magB);
};

// 🔹 fake embedding (since Groq doesn't provide embeddings free)
const fakeEmbedding = (text) => {
  return text.split("").map((c) => c.charCodeAt(0) % 10);
};

router.post("/chat", protect, async (req, res) => {
  try {
    const { message } = req.body;

    // 🔥 STEP 1 — EMBEDDING
    const queryEmbedding = fakeEmbedding(message);

    // 🔥 STEP 2 — REDIS CACHE CHECK (skip gracefully if Redis is down)
    try {
      const keys = await redis.keys("ai:*");

      for (let key of keys) {
        const cached = JSON.parse(await redis.get(key));

        const score = similarity(queryEmbedding, cached.embedding);

        if (score > 0.9) {
          console.log("⚡ Cache HIT");
          return res.json({ reply: cached.reply });
        }
      }

      console.log("❌ Cache MISS");
    } catch (redisErr) {
      console.warn("⚠️ Redis unavailable, skipping cache read:", redisErr.message);
    }

    const lower = message.toLowerCase();
    let reply = "";

    // 🔥 TOOL 1: PRICE
    if (lower.includes("price")) {
      const symbol = message.split(" ").pop().toUpperCase();

      const response = await fetch(`http://localhost:4000/api/market/${symbol}`);
      const data = await response.json();

      reply = `📈 ${symbol} is $${data.price} (${data.change}%)`;
    }

    // 🔥 TOOL 2: BUY
    else if (lower.includes("buy")) {
      const symbol = message.split(" ").pop().toUpperCase();

      await fetch("http://localhost:4000/api/trade/buy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization
        },
        body: JSON.stringify({
          symbol,
          price: 100
        })
      });

      reply = `✅ Bought ${symbol}`;
    }

    // 🔥 TOOL 3: SELL
    else if (lower.includes("sell")) {
      const symbol = message.split(" ").pop().toUpperCase();

      await fetch("http://localhost:4000/api/trade/sell", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.headers.authorization
        },
        body: JSON.stringify({
          symbol,
          price: 100
        })
      });

      reply = `💸 Sold ${symbol}`;
    }

    // 🔥 TOOL 4: PORTFOLIO
    else if (lower.includes("portfolio")) {
      const portfolio = await Portfolio.findOne({ userId: req.user.id });

      reply = `💼 Balance: $${portfolio?.balance}, Holdings: ${portfolio?.holdings.length}`;
    }

    // 🔥 GROQ AI (REAL AI RESPONSE)
    else {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROQ_API_KEY}`
  },
 body: JSON.stringify({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: "You are a smart AI stock trading assistant."
    },
    {
      role: "user",
      content: message
    }
  ]
})
});

const data = await response.json();

if (data?.choices?.length > 0) {
  reply = data.choices[0].message.content;
} else {
  console.error("AI ERROR:", data);
  reply = "⚠️ AI not responding. Please try again.";
}
    }

    // 🔥 STEP 3 — SAVE CACHE (skip gracefully if Redis is down)
    try {
      await redis.set(
        `ai:${Date.now()}`,
        JSON.stringify({
          embedding: queryEmbedding,
          reply
        })
      );
    } catch (redisErr) {
      console.warn("⚠️ Redis unavailable, skipping cache write:", redisErr.message);
    }

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

export default router;